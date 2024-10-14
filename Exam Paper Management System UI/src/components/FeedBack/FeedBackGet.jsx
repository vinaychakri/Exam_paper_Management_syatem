import { getFeedById, removeFeedBack } from "../../utilities/api";
import { useEffect, useCallback, useState } from "react";
import { verifyUser } from "../../utilities/localStorage";
import { useStore } from "../../store/store";
import {
  Group,
  Avatar,
  Text,
  Loader,
  Card,
  Progress,
  Badge,
  Button,
} from "@mantine/core";
import { capitalizeWords } from "../../utilities/helper";
import { IconTrash } from "@tabler/icons-react";
import toast from "react-hot-toast";

const FeedBackGet = ({ id, state }) => {
  const { listOfFeedBack, setListOfFeedBack } = useStore();
  const verifiedUser = verifyUser();
  const user = verifiedUser?.user?.email;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getFeedById(id);
        setListOfFeedBack(res.data);
      } catch (error) {
        console.log("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    setListOfFeedBack([]);
    fetchData();
  }, [id, state]);

  const deleteFeed = useCallback(
    async (id) => {
      try {
        await removeFeedBack(id);
        setListOfFeedBack(
          listOfFeedBack.filter((feedback) => feedback._id !== id),
        );
      } catch (error) {
        console.error("Error deleting", error);
      }
    },
    [listOfFeedBack, setListOfFeedBack],
  );

const formatTimeDifference = (updatedAt) => {
    const currentTime = new Date();
    const timeDiff = currentTime - new Date(updatedAt);
    
    // Calculate the number of days
    const diffInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const days = diffInDays > 0 ? `${diffInDays} days, ` : '';

    // Calculate the remaining hours after subtracting days
    const remainingHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const hours = remainingHours > 0 ? `${remainingHours} hrs, ` : '';

    // Calculate the remaining minutes after subtracting days and hours
    const remainingMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const minutes = remainingMinutes > 0 ? `${remainingMinutes} mins, ` : '';

    // Calculate the remaining seconds after subtracting days, hours, and minutes
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return days + hours + minutes + (seconds > 0 || (days === '' && hours === '' && minutes === '') ? `${seconds} sec ago` : '');
};


  return (
    <>
      {isLoading ? (
        <div>
          <Loader />
        </div>
      ) : listOfFeedBack.length === 0 ? (
        <h5 className="text-center">
          <Text>We don't have any Comments yet on this Topic.</Text>
        </h5>
      ) : (
        listOfFeedBack.map((feedback) => {
          const {
            _id,
            review,
            picture,
            createdBy,
            feedBackFrom,
            updatedAt,
            userType,
          } = feedback;
          return (
            <div key={_id} className="get-comment">
              <Card withBorder padding="md" radius="md">
                <Group justify="space-between">
                  <Avatar size={40} src={picture} radius="lg" />
                  <Badge> {formatTimeDifference(updatedAt)}</Badge>
                </Group>
                <Text fz="lg" fw={500} mt="md">
                  FeedBack
                </Text>
                <Text fz="sm" c="dimmed" mt={5}>
                  {review}
                </Text>
                <Progress value={(36 / 36) * 100} mt={8} size={"sm"} />
                <Group justify="space-between" mt="md">
                  <Text fz="sm" c="dimmed">
                    Question Paper Crated By: {createdBy}
                  </Text>
                  {feedBackFrom === user ? (
                    <>
                      <Button onClick={() => deleteFeed(_id)}>
                        <IconTrash />
                      </Button>
                    </>
                  ) : (
                    <i className="text-end">
                      <Group gap="sm">
                        <Avatar size={40} src={picture} radius="lg" />
                        <div>
                          <Text fz="sm" fw={500}>
                            {capitalizeWords(userType)}
                          </Text>
                          <Text fz="xs" c="dimmed">
                            By {feedBackFrom}
                          </Text>
                        </div>
                      </Group>
                    </i>
                  )}
                </Group>
              </Card>
            </div>
          );
        })
      )}
    </>
  );
};

export default FeedBackGet;
