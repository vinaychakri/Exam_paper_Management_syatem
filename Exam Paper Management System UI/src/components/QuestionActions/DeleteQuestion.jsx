import { useCallback } from "react";
import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { removeQuestionPaper } from "../../utilities/api";
import { useStore } from "../../store/store";

const DeleteQuestion = ({ id }) => {
  const { listOfQuestions, setListOfQuestions } = useStore();

  const deleteQuestion = useCallback(
    async (id) => {
      try {
        await removeQuestionPaper(id);
        setListOfQuestions(
          listOfQuestions.filter((questionPaper) => questionPaper._id !== id),
        );
      } catch (error) {
        console.error("Error deleting", error);
      }
    },
    [listOfQuestions, setListOfQuestions],
  );
  return (
    <>
      <Button onClick={() => deleteQuestion(id)}>
        <IconTrash />
      </Button>
    </>
  );
};

export default DeleteQuestion;
