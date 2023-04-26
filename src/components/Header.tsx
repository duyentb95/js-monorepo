import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Heading, Flex, Box } from "@chakra-ui/react";
import { AccountSwitcher } from "./Header/index";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <Flex p="3" borderBottom="1px solid rgba(255,255,255,0.2)" align="center">
      <Heading size="lg" fontWeight="300" fontFamily="mono">
        <Link to="/">Synthetix Perps V3 Prototype</Link>
      </Heading>
      <Box ml="auto">
        <Flex>
          <AccountSwitcher />
          <Box ml="4">
            {/** @see https://www.rainbowkit.com/docs/connect-button */}
            <ConnectButton accountStatus="address" />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
