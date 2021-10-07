// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Membership {
    
    using Counters for Counters.Counter;
    Counters.Counter public orgaCounter;
    Counters.Counter public memberCounter;
    
    struct Organization {
        uint256 id;
        address admin;
        string name;
        string logoURI;
        string certificationURI;
        string membershipCriteria;
        string revokationCriteria;
        bool canRevoke;
    }
    
    mapping (uint256=>Counters.Counter) public organizationToTotalMembers;
    mapping (address=>Counters.Counter) public memberToTotalOrganizations;
    mapping (uint256=>address[]) private _organizationToMembers;
    mapping (address=>uint256[]) private _memberToOrganizations;
    
    Organization[] public _organizations;
    
    modifier onlyAdmin(uint256 orgaId_) {
      require(msg.sender == _organizations[orgaId_].admin);
      _;
    }
    
    event NewOrganization(uint256 orgaId, string name, address by, uint256 createdAt,string logoURI, string certificationURI, string membershipCriteria, string revokationCriteria, bool canRevoke);
    event ItemModified(string itemDesc, uint256 orgaId, string old, string newValue, address by);
    event MemberAdded(uint256 orgaId, address addedMember);
    event MemberRevoked(uint256 orgaId, address addedMember);
    
    constructor() {}
    
    function createOrganization(string memory name_, string memory logoURI_, string memory certificationURI_, string memory membershipCriteria_, bool canRevoke_, string memory revokationCriteria_) public {
        require(this.stringLength(name_) > 0, "Organization must have a name");
        uint256 orgaId = orgaCounter.current();
        _organizations.push(
            Organization(orgaId,msg.sender,name_,logoURI_,certificationURI_,membershipCriteria_,revokationCriteria_,canRevoke_)
        );
        organizationToTotalMembers[orgaId] = Counters.Counter(0);
        orgaCounter.increment();
        emit NewOrganization(orgaId,name_,msg.sender,block.timestamp,logoURI_,certificationURI_,membershipCriteria_,revokationCriteria_,canRevoke_);
    }

    function addMember(uint256 orgaId_, address newMember_) public onlyAdmin(orgaId_) {
        require(!isMemberOf(newMember_,orgaId_),"Cannot add a member to an organization twice");
        
        //Add orga_id to member
        _organizationToMembers[orgaId_].push(newMember_);
        organizationToTotalMembers[orgaId_].increment();
        
        //Add member to orga
        _memberToOrganizations[newMember_].push(orgaId_);
        
        memberToTotalOrganizations[newMember_].increment();
        memberCounter.increment();
        emit MemberAdded(orgaId_, newMember_);
    }
    
    function revokeMember(uint256 orgaId_, address member_) public onlyAdmin(orgaId_) {
        require(_organizations[orgaId_].canRevoke,"Members of that organization are not revokable");
        require(isMemberOf(member_,orgaId_),"Given address is not a member of the organization");
        
        //Remove member from organization:
        removeMemberFromOrganization(member_,orgaId_);
        
        //Remove orgaId from a member's list of orga_ids:
        removeOrgaIdForAMember(orgaId_,member_);
    
        organizationToTotalMembers[orgaId_].decrement();
        memberToTotalOrganizations[member_].decrement();
        memberCounter.decrement();
        emit MemberRevoked(orgaId_, member_);
    }
    
    function memberOf(address member_) public view returns (uint256 [] memory) {
        return _memberToOrganizations[member_];
    }
    
    function changeName(uint256 orgaId_, string memory name_) public onlyAdmin(orgaId_) {
        string memory old_name = _organizations[orgaId_].name;
        _organizations[orgaId_].name = name_;
        emit ItemModified("name",orgaId_,old_name,name_,msg.sender);
    }
    
    function changeLogoURI(uint256 orgaId_, string memory newURI_) public onlyAdmin(orgaId_) {
        string memory old_uri = _organizations[orgaId_].logoURI;
        _organizations[orgaId_].logoURI = newURI_;
        emit ItemModified("logoURI",orgaId_,old_uri,newURI_,msg.sender);
    }
    
    function changeCertificationURI(uint256 orgaId_, string memory newURI_) public onlyAdmin(orgaId_) {
        string memory old_uri = _organizations[orgaId_].certificationURI;
        _organizations[orgaId_].certificationURI = newURI_;
        emit ItemModified("certifURI",orgaId_,old_uri,newURI_,msg.sender);
    }
    
    function changeMembershipCriteria(uint256 orgaId_, string memory newMembershipCriteria_) public onlyAdmin(orgaId_) {
        string memory old_criteria = _organizations[orgaId_].membershipCriteria;
        _organizations[orgaId_].membershipCriteria = newMembershipCriteria_;
        emit ItemModified("membershipCriteria",orgaId_,old_criteria,newMembershipCriteria_,msg.sender);
    }
    
    function changeRevokationCriteria(uint256 orgaId_, string memory newRevokationCriteria_) public onlyAdmin(orgaId_) {
        string memory old_criteria = _organizations[orgaId_].revokationCriteria;
        _organizations[orgaId_].revokationCriteria = newRevokationCriteria_;
        emit ItemModified("revokationCriteria",orgaId_,old_criteria,newRevokationCriteria_,msg.sender);
    }
    
    function isMemberOf(address member_, uint256 orgaId_) public view returns (bool) {
        for (uint256 i = 0; i<_memberToOrganizations[member_].length;i++){
            if (_memberToOrganizations[member_][i] == orgaId_){
                return true;
            }
        }
        return false;
    }
    
    function stringLength(string calldata str) external pure returns(uint256) {
        return bytes(str).length;
    }
    
    function _findMemberIdInOrga(address member_, uint256 orgaId_) internal view returns (uint256, bool) {
        uint256 size = organizationToTotalMembers[orgaId_].current();
        for (uint256 i = 0; i < size; i++){
            if (_organizationToMembers[orgaId_][i] == member_){
                return (i, true);
            }
        }
        return (0, false);
    }
    
    function removeMemberFromOrganization(address member_, uint256 orgaId_) internal {
        (uint256 atId, bool itemFound) = _findMemberIdInOrga(member_, orgaId_);
        if (itemFound){
            uint256 size = organizationToTotalMembers[orgaId_].current();
            _organizationToMembers[orgaId_][atId] = _organizationToMembers[orgaId_][size-1];
            _organizationToMembers[orgaId_].pop();
        }
    }
    
    function _findOrgaIdForAMember(uint256 orgaId_, address member_) internal view returns (uint256, bool) {
        uint256 size = memberToTotalOrganizations[member_].current();
        for (uint256 i = 0; i < size; i++){
            if (_memberToOrganizations[member_][i] == orgaId_){
                return (i, true);
            }
        }
        return (0, false);
    }
    
    function removeOrgaIdForAMember(uint256 orgaId_, address member_) internal {
        (uint256 atId, bool itemFound) = _findOrgaIdForAMember(orgaId_, member_);
        if (itemFound){
            uint256 size = memberToTotalOrganizations[member_].current();
            _memberToOrganizations[member_][atId] = _memberToOrganizations[member_][size-1];
            _memberToOrganizations[member_].pop();
        }
    }
    
}