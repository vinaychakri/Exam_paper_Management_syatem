import { Avatar, Text } from "@mantine/core";
const ImageAvatar = ({ src }) => (
  <>
    <Avatar src={src} color="indigo" radius={"lg"} size={50} />
  </>
);

function createOutputArray(data) {
  const outputArray = [];

  for (let i = 0; i < data.currentApprovedBy.length; i++) {
    const approvedObj = data.currentApprovedBy[i];
    const userImage = data.approvedImages[i];

    const newObj = {
      approvedEmail: approvedObj.approvedEmail,
      approvedUserType: approvedObj.approvedUserType,
      _id: approvedObj._id,
      userImage: userImage,
    };

    outputArray.push(newObj);
  }

  return outputArray;
}
export function UserDetails({ currentApprovalDetails }) {
  const ApprovedUser = createOutputArray(currentApprovalDetails);

  return (
    <div className="approvedUsers">
      {ApprovedUser?.map((user, index) => (
        <div key={index} className="row user">
          <div className="col-2">
            <ImageAvatar src={user.userImage} />
          </div>
          <div className="col-10">
            <Text c="dimmed" size="sm">
              {user.approvedEmail}
            </Text>
            <Text size="sm" fw={500}>
              {user.approvedUserType}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}
