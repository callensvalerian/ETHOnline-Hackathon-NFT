window.membership_address = "0x4C23FBa7306120368c34F4b3d5ed45E1759837D5"
window.membership_abi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "itemDesc",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orgaId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "old",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "newValue",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "by",
          "type": "address"
        }
      ],
      "name": "ItemModified",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orgaId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "addedMember",
          "type": "address"
        }
      ],
      "name": "MemberAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orgaId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "addedMember",
          "type": "address"
        }
      ],
      "name": "MemberRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orgaId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "by",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "logoURI",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificationURI",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "membershipCriteria",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "revokationCriteria",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "canRevoke",
          "type": "bool"
        }
      ],
      "name": "NewOrganization",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "_organizations",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "admin",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "logoURI",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "certificationURI",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "membershipCriteria",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "revokationCriteria",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "canRevoke",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "memberCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "memberToTotalOrganizations",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "orgaCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "organizationToTotalMembers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "logoURI_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "certificationURI_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "membershipCriteria_",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "canRevoke_",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "revokationCriteria_",
          "type": "string"
        }
      ],
      "name": "createOrganization",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orgaId_",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "newMember_",
          "type": "address"
        }
      ],
      "name": "addMember",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orgaId_",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "member_",
          "type": "address"
        }
      ],
      "name": "revokeMember",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "member_",
          "type": "address"
        }
      ],
      "name": "memberOf",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orgaId_",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        }
      ],
      "name": "changeName",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orgaId_",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "newURI_",
          "type": "string"
        }
      ],
      "name": "changeLogoURI",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orgaId_",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "newURI_",
          "type": "string"
        }
      ],
      "name": "changeCertificationURI",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orgaId_",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "newMembershipCriteria_",
          "type": "string"
        }
      ],
      "name": "changeMembershipCriteria",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orgaId_",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "newRevokationCriteria_",
          "type": "string"
        }
      ],
      "name": "changeRevokationCriteria",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "member_",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "orgaId_",
          "type": "uint256"
        }
      ],
      "name": "isMemberOf",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "str",
          "type": "string"
        }
      ],
      "name": "stringLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "pure",
      "type": "function"
    }
  ]