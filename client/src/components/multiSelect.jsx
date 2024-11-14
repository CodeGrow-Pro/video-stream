import React from 'react';
import { Select, Space } from 'antd';
const options = [
    "Mathematics",
    "English",
    "Science",
    "Social Studies",
    "Environmental Studies",
    "Physical Education",
    "Art",
    "Music",
    "Computer Science",
    "History",
    "Geography",
    "Biology",
    "Chemistry",
    "Physics",
    "Economics",
    "Political Science",
    "Sociology",
    "Psychology",
    "Philosophy",
    "Business Studies",
    "Accountancy",
    "Statistics",
    "Computer Applications",
    "Information Technology",
    "Electronics",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Marketing",
    "Finance",
    "Human Resource Management",
    "Operations Management",
    "Entrepreneurship",
    "Public Administration",
    "Law",
    "Education",
    "Library Science",
    "Biotechnology",
    "Genetics",
    "Microbiology",
    "Zoology",
    "Botany",
    "Environmental Science",
    "Agricultural Science",
    "Forestry",
    "Veterinary Science",
    "Medicine",
    "Dentistry",
    "Nursing",
    "Pharmacy",
    "Public Health",
    "Nutrition",
    "Physiotherapy",
    "Sports Science",
    "Astronomy",
    "Anthropology",
    "Archaeology",
    "Linguistics",
    "Literature",
    "Fine Arts",
    "Theatre",
    "Film Studies",
    "Media Studies",
    "Journalism",
    "Mass Communication",
    "International Relations",
    "Gender Studies",
    "Cultural Studies",
    "Theology",
    "Religious Studies",
    "Architecture",
    "Urban Planning",
    "Fashion Design",
    "Interior Design",
    "Graphic Design",
    "Animation",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cybersecurity",
    "Blockchain",
    "Robotics",
    "Software Engineering",
    "Network Engineering",
    "Game Development",
    "Digital Marketing",
    "Econometrics",
    "Geology",
    "Oceanography",
    "Meteorology",
    "Astrophysics",
    "Quantum Physics",
    "Neuroscience",
    "Bioinformatics",
    "Ecology",
    "Molecular Biology",
    "Social Work",
    "Cognitive Science",
    "Ethics",
    "Critical Thinking"
].map((item) => {
    return { label: item, value: item };
})

const MultiSelect = ({ defaultValue = null, handleChange, title = "Strength" }) => {
    return <Space
        style={{
            width: '100%',
        }}
        direction="vertical"
    >
        <Select
            id={title}
            mode="multiple"
            allowClear
            style={{
                width: '98%',
            }}
            placeholder={"Please select " + title}
            defaultValue={defaultValue || []}
            onChange={handleChange}
            options={options}
        />
    </Space>
}
export default MultiSelect;