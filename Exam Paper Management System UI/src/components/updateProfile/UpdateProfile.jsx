import React, { useState, useEffect } from "react";
import { getUserInformation, updateUserDepartments } from "../../utilities/api"; // Assuming updateUserDepartments is your API call function
import { verifyUser } from "../../utilities/localStorage";
import {
  Avatar,
  Text,
  Group,
  Stack,
  MultiSelect,
  Button,
  Loader,
} from "@mantine/core";
import { IconCreativeCommonsSa, IconAt } from "@tabler/icons-react";
import classes from "./UpdateProfile.module.css";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { departmentsList } from "../../utilities/helper";
const Loading = () => {
  return (
    <div className="loader">
      {" "}
      <Loader />
    </div>
  );
};
const Error = (message) => {
  return <div> {message}</div>;
};
export default function UpdateProfile() {
  const { userDataInfo, setUserDataInfo } = useStore();
  const userId = verifyUser()?.user?._id;
  const routeNavigate = useNavigate();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          const res = await getUserInformation(userId);
          setUserDataInfo(res.data);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleDepartmentChange = (value) => {
    setSelectedDepartments(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const profileUpdated = userDataInfo[0]?.profileUpdated;
    const userDepartments = { selectedDepartments, profileUpdated, userId };
    if (selectedDepartments.length === 0) {
      alert("Please select at least one department.");
    } else {
      updateUserDepartments(userDepartments)
        .then((res) => {
          alert(res.data.message);
          if (res.data.departments) {
            localStorage.setItem(
              "departments",
              JSON.stringify(res.data.departments),
            );
          }
          const userType = verifyUser()?.user?.userType;
          if (userType === "professor") {
            routeNavigate("/dashboard");
          } else if (userType === "examinationOfficer") {
            routeNavigate("/questions");
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    }
  };
  if (isLoading) return <Loading />;
  if (error) return <Error message={{ error }} />;
  if (userDataInfo.length === 0) return <div>User not found</div>;
  const imageURl = userDataInfo[0].picture;
  console.log(imageURl);
  return (
    <div className="update-profile-container">
      <h2>Welcome, {userDataInfo[0]?.name}</h2>
      {/* <img src="https://lh3.googleusercontent.com/a/ACg8ocJVScAkzTsCivtyIlmHoZOlOLolCUGsYnk5WpF8oxctt6mnbIFE8g=s96-c" alt="ok"></img>
      <object
      data="https://lh3.googleusercontent.com/a/ACg8ocJVScAkzTsCivtyIlmHoZOlOLolCUGsYnk5WpF8oxctt6mnbIFE8g=s96-c"
      type="image/svg+xml"
      width="100"
      height="100"
    >
    </object> */}
      <Avatar src={imageURl} size={150} radius="xl" />
      <div className="current-information">
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          {userDataInfo[0]?.userType}
        </Text>

        <Text fz="lg" fw={500} className={classes.name}>
          {userDataInfo[0]?.name}
        </Text>

        <Group wrap="nowrap" gap={10} mt={3}>
          <IconAt stroke={1.5} size="1rem" className={classes.icon} />
          <Text fz="xs" c="dimmed">
            {userDataInfo[0]?.email}
          </Text>
        </Group>

        <Group wrap="nowrap" gap={10} mt={5}>
          <IconCreativeCommonsSa
            stroke={1.5}
            size="1rem"
            className={classes.icon}
          />
          <Text fz="xs" c="dimmed">
            {userDataInfo[0]?.createdAt.split("T")[0]}
          </Text>
        </Group>
      </div>

      {userDataInfo[0]?.profileUpdated === false && (
        <form onSubmit={handleFormSubmit}>
          <Stack>
            <MultiSelect
              required
              label="Select Departments"
              data={departmentsList}
              searchable
              value={selectedDepartments}
              onChange={handleDepartmentChange}
            />
          </Stack>
          <Group justify="space-between" mt="xl">
            <Button type="submit" radius="xl">
              Update Departments
            </Button>
          </Group>
        </form>
      )}
      {userDataInfo[0]?.profileUpdated === true && (
        <form onSubmit={handleFormSubmit}>
          <Group wrap="nowrap" gap={10} mt={5}>
            Departments:
            {userDataInfo[0]?.departments.map((value, key) => {
              return (
                <div key={key}>
                  <Text fz="md" c="dimmed">
                    {value}
                  </Text>
                </div>
              );
            })}
          </Group>
        </form>
      )}
    </div>
  );
}
