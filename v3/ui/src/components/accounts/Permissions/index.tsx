import {
  Box,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { utils } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useAccountRead, useSynthetixProxyEvent, useSynthetixRead } from '../../../hooks';
import { Address } from '../../shared/Address';
import { Item } from './Item';
import { PermissionsEditor } from './PermissionsEditor';
import { TransferOwnership } from './TransferOwnership';

export default function Permissions() {
  const [accountPermissions, setAccountPermissions] = useState<Record<string, Array<string>>>({});

  // Only show edit icon if current account is owner or modify permissions
  const { address: accountAddress } = useAccount();
  const { id: accountId } = useParams();

  const { isLoading: loadingAccountPermissions, data: permissionData } = useSynthetixRead({
    functionName: 'getAccountPermissions',
    args: [accountId],
    enabled: Boolean(accountId),
    select: (data) => {
      return data.reduce(
        (acc, { target, roles }) => ({
          ...acc,
          [target]: roles.map((r: string) => utils.parseBytes32String(r)),
        }),
        {}
      );
    },
  });

  useEffect(() => {
    if (permissionData && !loadingAccountPermissions) {
      setAccountPermissions(permissionData);
    }
  }, [loadingAccountPermissions, permissionData]);

  useSynthetixProxyEvent({
    eventName: 'RoleGranted',
    listener: (event) => {
      const [eventAccountId, role, target] = event;

      if (accountId === eventAccountId.toString()) {
        setAccountPermissions((currentPermissions) => {
          const parsedRole = utils.parseBytes32String(role);
          const targetPermissions = currentPermissions[target];

          if (!targetPermissions?.includes(parsedRole)) {
            return {
              ...currentPermissions,
              [target]: targetPermissions
                ? [...targetPermissions, utils.parseBytes32String(role)]
                : [utils.parseBytes32String(role)],
            };
          } else {
            return currentPermissions;
          }
        });
      }
    },
  });

  useSynthetixProxyEvent({
    eventName: 'RoleRevoked',
    listener: (event) => {
      const [eventAccountId, role, target] = event;
      if (accountId === eventAccountId.toString()) {
        setAccountPermissions((currentPermissions) => {
          const targetPermissions = currentPermissions[target];
          return {
            ...currentPermissions,
            [target]: targetPermissions
              ? targetPermissions.filter((r) => r !== utils.parseBytes32String(role))
              : [],
          };
        });
      }
    },
  });

  const { isLoading: loadingOwner, data: accountOwner } = useAccountRead({
    functionName: 'ownerOf',
    args: [accountId],
    enabled: Boolean(accountId),
    cacheTime: 0,
  });

  return (
    <Box>
      <Flex mb="2">
        <Heading size="md" mb="1">
          Permissions
        </Heading>
        <Box ml="auto">
          {/* only render below if owner or has modify permissions role */}
          <PermissionsEditor />
        </Box>
      </Flex>
      {Boolean(accountOwner) ? (
        <Stack>
          <Table size="sm" variant="simple" mb="8">
            <Thead>
              <Tr>
                <Th color="white" pb="2">
                  Address
                </Th>
                <Th color="white" pb="2">
                  Permissions
                </Th>
                <Th color="white" pb="2"></Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td py="4">
                  <Skeleton isLoaded={!loadingOwner}>
                    {/* wagmi types return Result which needs to be generic but currently assumes is an object */}
                    {/* @ts-ignore */}
                    <Address address={accountOwner} />
                  </Skeleton>
                </Td>
                <Td>
                  <Tag colorScheme="purple" size="sm" mr="1">
                    Owner
                  </Tag>
                </Td>
                <Td>{accountAddress == accountOwner && <TransferOwnership />}</Td>
              </Tr>

              {Object.keys(accountPermissions).map((target) => {
                return <Item key={target} address={target} roles={accountPermissions[target]} />;
              })}
            </Tbody>
          </Table>
        </Stack>
      ) : (
        <Text>No permissions</Text>
      )}
    </Box>
  );
}
