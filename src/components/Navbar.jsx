import { Box, Flex, Button, DropdownMenu } from "@radix-ui/themes";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "@/context/user.context";
import { FaUserCircle } from "react-icons/fa";
import { logout } from "../utils/firebase";
import { multiFactor, PhoneMultiFactorGenerator } from "firebase/auth";
import ThemeToggle from "./ThemeToggle";
import usePremiumStatus from "@/hooks/usePremiumStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  // checks if the user has used mfa or google sign in
  const isGoogleUser =
    !!currentUser &&
    currentUser.providerData?.some((p) => p?.providerId === "google.com");

  const hasSmsMfa =
    !!currentUser &&
    multiFactor(currentUser).enrolledFactors?.some(
      (f) => f.factorId === PhoneMultiFactorGenerator.FACTOR_ID
    );

  const isSignedIn = isGoogleUser || hasSmsMfa;

  const { isPremium, loading } = usePremiumStatus(currentUser);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("error signing out", error);
    }
  };

  return (
    <Box asChild>
      <nav>
        <Flex align="center" justify="between" p="5">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/connect">Contact Us</Link>
          <Link to="/questions">Find Question</Link>
          <Link to="/plans">Plans & Pricing</Link>

          {!loading && isPremium && <ThemeToggle />}

          {isSignedIn ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button aria-label="User menu">
                  {isPremium ? (
                    <FontAwesomeIcon
                      icon={faCrown}
                      style={{ color: "gold", fontSize: 22 }}
                    />
                  ) : (
                    <FaUserCircle size={24} />
                  )}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {isPremium && (
                  <>
                    <DropdownMenu.Item asChild>
                      <Link to="/saved">Saved Items</Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                  </>
                )}
                <DropdownMenu.Item asChild>
                  <Link to="/tutorials">My Tutorials</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={handleLogout}>
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : (
            <Flex align="center" gap="2">
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </Flex>
          )}
        </Flex>
        <Outlet />
      </nav>
    </Box>
  );
}
export default Navbar;
