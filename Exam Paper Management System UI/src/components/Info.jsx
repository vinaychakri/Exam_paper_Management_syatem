// Importing necessary components and icons from mantine and tabler-icons-react
import { RingProgress, Text, SimpleGrid, Paper, Center, Group, rem } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight, IconInfoCircle, IconLock, IconUserCheck, IconDatabase } from '@tabler/icons-react';

// Mapping icons to specific keys for easy reference
const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
  info: IconInfoCircle,
  lock: IconLock,
  user: IconUserCheck,
  database: IconDatabase,
};

// Data array containing information for each section of the Info component
const data = [
  {
    label: 'Bridging the Technology Gap',
    description:
      'By integrating cutting-edge technologies like React, Node.js, and MongoDB, this project bridges the gap in outdated academic administration techniques, strengthening security protocols and ensuring the integrity and confidentiality of critical intellectual content.',
    icon: 'info',
    color: 'teal',
  },
  {
    label: 'Streamlining Exam Paper Processes',
    description:
      'The project creates a solid solution that improves user experience by automating workflows and lessening errors for evaluation officers and lecturers, thereby refining the complex processes associated with exam paper planning and management.',
    icon: 'info',
    color: 'blue',
  },
  {
    label: 'Enhancing Operational Efficiency',
    description:
      `By addressing long-standing obstacles and inefficiencies in conventional administrative operations, this project aims to improve academic institutions' operational frameworks in a concrete and effective manner, allowing lecturers and examination officers to focus on more important academic tasks.`,
    icon: 'info',
    color: 'red',
  },
  {
    label: 'Scalability and Adaptability',
    description:
      `The project's utilization of contemporary technology provides scalability and adaptability, establishing it as an invaluable resource for educational institutions aiming to maintain competitiveness and agility in the rapidly evolving field of education.`,
    icon: 'info',
    color: 'violet',
  },
  {
    label: 'Robust Security Measures',
    description:
      'The system incorporates robust security measures to ensure the confidentiality and integrity of sensitive academic materials, leveraging industry-standard encryption and access control mechanisms.',
    icon: 'lock',
    color: 'orange',
  },
  {
    label: 'User-friendly Interface',
    description:
      'The web application features a user-friendly interface tailored to the specific roles and responsibilities of lecturers, examination officers, and administrators, ensuring a seamless and intuitive experience.',
    icon: 'user',
    color: 'grape',
  },
  {
    label: 'Reliable Data Management',
    description:
      'With MongoDB as the database backend, the system offers reliable and efficient data management, ensuring the secure storage and retrieval of examination materials and associated metadata.',
    icon: 'database',
    color: 'lime',
  },
];

// Info component that renders information sections using data array
export function Info() {
  // Mapping through data array to create individual info sections
  const infoSections = data.map((section) => {
    const Icon = icons[section.icon]; // Accessing the correct icon based on section data

    return (
      <div className="info" key={section.label}>
        <Paper withBorder radius="md" p="xs">
          <Group>
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[{ value: 100, color: section.color }]}
              label={
                <Center>
                  <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                </Center>
              }
            />
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {section.label}
              </Text>
              <Text fw={700} size="sm">
                {section.description}
              </Text>
            </div>
          </Group>
        </Paper>
      </div>
    );
  });

  // Returning a grid layout that adapts based on screen size, containing all info sections
  return <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>{infoSections}</SimpleGrid>;
}