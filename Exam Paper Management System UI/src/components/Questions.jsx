import { useEffect } from "react";
import { getAllQuestion } from "../utilities/api";
import { useStore } from "../store/store";
import { verifyUser } from "../utilities/localStorage";

import { Avatar, Badge, Table, Group, Text, Button } from "@mantine/core";
import ViewQuestionPaper from "./ViewQuestionPaper";
import DeleteQuestion from "./QuestionActions/DeleteQuestion";
import UpdateQuestion from "./QuestionActions/UpdateQuestion";

function Questions() {
  const {
    listOfQuestions,
    setListOfQuestions,
    stateManagement,
    setStateManagement,
  } = useStore();
  const verifiedUser = verifyUser();
  const userEmail = verifiedUser?.user?.email;
  const userType = verifiedUser?.user?.userType;
  var currentURL = document.location.pathname;
  const currentUserDepartments =
  verifiedUser?.departments?.departments ||  verifiedUser?.user?.departments
  const fetchData = async () => {
    try {
      const res = await getAllQuestion();
      setListOfQuestions(res.data.allQuestions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [setListOfQuestions, stateManagement]);
  const rows = listOfQuestions
    .filter((questionSet) => {
      if (userType === "professor") {
        if (currentURL === "/yourQuestions") {
          return questionSet.userEmail === userEmail;
        } else if (currentURL === "/questions") {
          const questionSetDepartments = questionSet?.departments?.map((dept) =>
            dept.trim().toLowerCase()
          ) || [];
          const Department = currentUserDepartments?.map((dept) =>
            dept.trim().toLowerCase()
          ) || [];
          return (
            questionSet.userEmail !== userEmail &&
            questionSetDepartments?.some((dept) =>
            Department.includes(dept)
            )
          );
        }
      }
      return questionSet.approvals >=  1;
    }).map((questionSet, index) => (
      <Table.Tr key={index}>
        <Table.Td>
          <Group gap="sm">
            <Avatar size={40} src={questionSet.picture} radius={40} />
            <div>
              <Text fz="sm" fw={500}>
                {questionSet?.questions[0]?.title}
              </Text>
              <Text fz="xs" c="dimmed">
                By {questionSet.userEmail}
              </Text>
            </div>
          </Group>
        </Table.Td>
        <Table.Td>
          <ViewQuestionPaper
            question={questionSet.questions}
            approvals={questionSet.approvals}
            updateMainList={() => {
              fetchData();
            }}
            createdBy={questionSet.userEmail}
            id={questionSet._id}
          />
        </Table.Td>
        <Table.Td className="departments">
          {questionSet.departments.map((department, index) => (
            <Text key={index}>{department}</Text>
          ))}
        </Table.Td>
        <Table.Td>{questionSet.updatedAt.split("T")[0]}</Table.Td>
        {userType === "examinationOfficer" ? (
          <Table.Td>
            {questionSet.approvals >= 1 ? (
              <>
                {questionSet.approvedBy.find(
                  (email) => email.approvedUserType === "examinationOfficer",
                ) ? (
                  <Badge fullWidth color="green" variant="light">
                    Approved
                  </Badge>
                ) : (
                  <Badge fullWidth color="yellow" variant="light">
                    Ready For your Review
                  </Badge>
                )}
              </>
            ) : (
              <Badge color="red" fullWidth variant="light">
                Pending Professor Review
              </Badge>
            )}
          </Table.Td>
        ) : (
          <Table.Td>
            {questionSet.approvals <= 0 ? (
              <Badge color="red" fullWidth variant="light">
                No Review yet
              </Badge>
            ) : (
              <>
                <>
                  {questionSet.approvedBy.find(
                    (email) => email.approvedUserType === "examinationOfficer",
                  ) ? (
                    <Badge fullWidth color="green" variant="light">
                      Ready for Test
                    </Badge>
                  ) : (
                    <Badge fullWidth color="yellow" variant="light">
                      Pending Officer review
                    </Badge>
                  )}
                </>
              </>
            )}
          </Table.Td>
        )}
        {currentURL === "/yourQuestions" ? (
          <>
            <Table.Td className="question-actions">
              <DeleteQuestion id={questionSet._id} />
              {!questionSet.approvedBy.some(
                (email) => email.approvedUserType === "examinationOfficer",
              ) && (
                <UpdateQuestion
                  QuestionData={questionSet}
                  updateWithCurrentData={setStateManagement}
                />
              )}
            </Table.Td>
          </>
        ) : (
          <></>
        )}
      </Table.Tr>
    ));
    if (rows.length === 0) {
      return (
        <div className="no-paper-container">
        <p className="no-paper-message">
          No Question Paper for your department at this point.
        </p>
      </div>
      );
    }
  
  return (
    <Table.ScrollContainer className="question-container">
      <Table verticalSpacing="lg">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User Email</Table.Th>
            <Table.Th>Question Paper</Table.Th>
            <Table.Th>Departments</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Status</Table.Th>
            {currentURL === "/yourQuestions" ? (
              <>
                <Table.Th>action</Table.Th>
              </>
            ) : (
              <></>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
export default Questions;
