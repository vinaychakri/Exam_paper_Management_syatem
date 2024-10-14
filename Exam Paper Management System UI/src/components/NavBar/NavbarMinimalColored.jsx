import { useEffect, useState } from "react";
import { Center, Tooltip, Stack, rem, Avatar } from "@mantine/core";
import {
  IconLogout,
  IconAlienFilled,
  IconQuestionMark,
  IconEyeQuestion,
  IconPencilQuestion,
  IconInfoCircleFilled,
} from "@tabler/icons-react";
import classes from "./NavbarMinimalColored.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ActionToggle } from "../Toggle/ActionToggle";
import { logoutUser, verifyUser } from "../../utilities/localStorage";
import { useStore } from "../../store/store";
import { getUserInformation } from "../../utilities/api";


function NavbarLink({ to, icon: Icon, label, onClick, isActive }) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 1 }}>
      <Link
        to={to}
        className={`${classes.link} ${isActive ? "active" : ""}`}
        onClick={onClick}
        data-active={isActive ? true : undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </Link>
    </Tooltip>
  );
}
const adminLinks = [
  { to: "/info", icon: IconInfoCircleFilled, label: "Application Information" },
  { to: "/authentication", icon: IconAlienFilled, label: "authentication" },
];

const customerProfessorLinks = [
  { to: "/updateProfile", icon: IconAlienFilled, label: "Profile" },
  { to: "/dashboard", icon: IconPencilQuestion, label: "Create Question paper" },
  { to: "/questions", icon: IconQuestionMark, label: "Question Papers" },
  {
    to: "/yourQuestions",
    icon: IconEyeQuestion,
    label: "Your Question Papers",
  },
];
const customerExaminationOfficerLinks = [
  { to: "/updateProfile", icon: IconAlienFilled, label: "Profile" },
  { to: "/questions", icon: IconQuestionMark, label: "Question Papers" },
];
export function NavbarMinimalColored() {
  const user = verifyUser()?.user?.userType;
  const { userDataInfo, setUserDataInfo } = useStore();

  const [active, setActive] = useState(0);
  const links =
    user === "examinationOfficer"
      ? customerExaminationOfficerLinks
      : user === "professor"
        ? customerProfessorLinks
        : adminLinks;

  const routeNavigate = useNavigate();
  const logout = () => {
    setUserDataInfo([]);
    logoutUser(() => routeNavigate("/authentication"));
  };

  const location = useLocation();
  const userId = verifyUser()?.user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const res = await getUserInformation(userId);
          setUserDataInfo(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);
  return (
    <nav className={classes.navbar}>
      <Center>
        <Avatar src={userDataInfo[0]?.picture} className={classes.logo} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links.map((link, index) => {
            return (
              <NavbarLink
                {...link}
                key={link.label}
                active={index === active}
                onClick={() => setActive(index)}
                isActive={link.to === location.pathname}
              />
            );
          })}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        {user && (
          <NavbarLink
            icon={IconLogout}
            label="Logout"
            onClick={logout}
            to={"/authentication"}
          />
        )}
        <br />
        <ActionToggle />
      </Stack>
    </nav>
  );
}
