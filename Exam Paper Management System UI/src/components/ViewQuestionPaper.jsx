import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Avatar, Group, Text, Badge, Card } from "@mantine/core";
import { FeedBack } from "./FeedBack/FeedBack";
import FeedBackGet from "./FeedBack/FeedBackGet";
import { useEffect, useReducer, useState } from "react";
import { verifyUser } from "../utilities/localStorage";
import { IconEyeQuestion } from "@tabler/icons-react";
import {
  approvalStatus,
  declineStatus,
  getCurrentApprovals,
} from "../utilities/api";
import { UserDetails } from "./UserApproved/UserDetails";

import classes from "./SwitchesCard.module.css";
import PdfDownloader from "../utilities/PdfDownloader";

function ViewQuestionPaper({ question, createdBy, id, updateMainList }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentApprovalDetails, setCurrentApprovalDetails] = useState([]);

  const [state, dispatch] = useReducer((x) => x + 1, 0);
  const verifiedUser = verifyUser();
  const userEmail = verifiedUser?.user?.email;
  const userType = verifiedUser?.user?.userType;
  const { currentApprovals, currentApprovedBy } = currentApprovalDetails;

  const [isLoading, setIsLoading] = useState(true);
  const pdfFile = question[0]?.rubrics?.[0];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getCurrentApprovals(id);
      setCurrentApprovalDetails(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  const handleApproval = async () => {
    const approvalIncrease = currentApprovals;
    const approvedBy = { id, userEmail, userType, approvalIncrease };
    await approvalStatus(approvedBy)
      .then((res) => {
        fetchData();
        updateMainList();
        dispatch();
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const handleDecline = async () => {
    const approvalReduce = currentApprovals;
    const declineBy = { id, userEmail, userType, approvalReduce };
    await declineStatus(declineBy)
      .then((res) => {
        fetchData();
        updateMainList();
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  const RenderApprovalButtons = () => {
    const isExaminationOfficer = userType === "examinationOfficer";
    const isProfessor = userType === "professor";
    const isCreator = userEmail !== createdBy;
    const hasApproved = currentApprovedBy.some(
      (email) => email.approvedEmail === userEmail,
    );

    if (
      (isCreator && currentApprovals >= 0 && isProfessor) ||
      (currentApprovals >= 1 && isExaminationOfficer)
    ) {
      return (
        <div className="approval-decline">
          <Button color="green" onClick={handleApproval} disabled={hasApproved}>
            Approve
          </Button>
          <Button onClick={handleDecline} disabled={!hasApproved}>
            Disapprove
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`${question[0]?.title}`}
        centered
        size="100%"
      >
        <div className="view-question-paper">
          <Group justify="space-between" mb={4}>
            <h6>
              Type of Question Paper :{" "}
              <Badge color="lime">{question[0]?.type} </Badge>
            </h6>
            <h6>
              Current Approvals :{" "}
              <Badge color="lime"> {currentApprovals}</Badge>
            </h6>
            {pdfFile && (
              <h6>
                Rubrics: <PdfDownloader file={pdfFile} />{" "}
              </h6>
            )}
          </Group>

          {question.map((question) => (
            <div key={question._id} className="row question-container">
              <div className="col-md-6">
                <Card withBorder radius="md" p="xl" className={classes.card}>
                  <Text fz="lg" className={classes.title} fw={500}>
                    {question.question}
                  </Text>
                  <Text fz="xs" c="dimmed" mt={3} mb="xl">
                    Marks for this Question {question.marks}
                  </Text>

                  <div>
                    {question.type === "MCQ" && (
                      <>
                        {question.options.map((option, index) => (
                          <Group
                            justify="space-between"
                            className={classes.item}
                            wrap="nowrap"
                            gap="xl"
                            key={option._id}
                          >
                            <div>
                              <Text>
                                {index + 1}. {option.option}
                              </Text>
                            </div>
                          </Group>
                        ))}
                        <Text>Correct Answer: {question.correctAnswer}</Text>
                      </>
                    )}
                  </div>
                </Card>
              </div>
              <div className="col-md-6">
                {question.image && question.image.length > 0 ? (
                  <div className="question-images">
                    {question.image.map((imageUrl, index) => (
                      <Avatar
                        key={index}
                        src={imageUrl}
                        size={200}
                        radius="xl"
                      />
                    ))}
                  </div>
                ) : (
                  <Text fz="lg" c="dimmed">
                    No images for this Question
                  </Text>
                )}
              </div>
            </div>
          ))}
          <div>
            <div className="approval-container">
              <RenderApprovalButtons />
              <UserDetails currentApprovalDetails={currentApprovalDetails} />
            </div>
            <FeedBackGet state={state} id={question[0]?.title} />
            <FeedBack
              approvals={currentApprovals}
              createdBy={createdBy}
              title={question[0]?.title}
              controller={() => {
                dispatch();
              }}
            />
          </div>
        </div>
      </Modal>

      <Button
        onClick={open}
        leftSection={<IconEyeQuestion size={20} />}
        variant="default"
      >
        <Group gap="xs">
          <div>
            <Text fz="xs" fw={300}>
              Open
            </Text>
            <Text fz="xs" c="dimmed">
              Question Paper
            </Text>
          </div>
        </Group>
      </Button>
    </>
  );
}

export default ViewQuestionPaper;
