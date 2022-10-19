export const address = '0x1523c93c5427d7dd66637737464e15cD5473b2d7';
export const abi = [
  'error InvalidPermission(bytes32 permission)',
  'error InvalidPermission()',
  'error MismatchAssociatedSystemKind(bytes32 expected, bytes32 actual)',
  'error OnlyAccountTokenProxy(address origin)',
  'error PermissionDenied(uint128 accountId, bytes32 permission, address user)',
  'error PermissionNotGranted(uint128 accountId, bytes32 permission, address user)',
  'error PositionOutOfBounds()',
  'error ValueAlreadyInSet()',
  'error ValueNotInSet()',
  'error ZeroAddress()',
  'event AccountCreated(address indexed sender, uint128 indexed accountId)',
  'event PermissionGranted(uint128 indexed accountId, bytes32 indexed permission, address indexed user, address sender)',
  'event PermissionRevoked(uint128 indexed accountId, bytes32 indexed permission, address indexed user, address sender)',
  'function createAccount(uint128 requestedAccountId)',
  'function getAccountOwner(uint128 accountId) view returns (address)',
  'function getAccountPermissions(uint128 accountId) view returns (tuple(address user, bytes32[] permissions)[] permissions)',
  'function getAccountTokenAddress() view returns (address)',
  'function grantPermission(uint128 accountId, bytes32 permission, address user)',
  'function hasPermission(uint128 accountId, bytes32 permission, address user) view returns (bool)',
  'function isAuthorized(uint128 accountId, bytes32 permission, address user) view returns (bool)',
  'function notifyAccountTransfer(address to, uint128 accountId)',
  'function renouncePermission(uint128 accountId, bytes32 permission)',
  'function revokePermission(uint128 accountId, bytes32 permission, address user)',
];
