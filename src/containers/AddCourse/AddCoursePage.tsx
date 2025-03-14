import React from "react";
import helloImage from "../../assets/img/hello.png";
import Button from "../../components/Button/Button";
import Header from "../../components/Header";
import { PageType } from "../Root/RootContainer";

interface AddCoursePageProps {
    onNavigate: (page: PageType) => void;
}

const AddCoursePage = ({ onNavigate }: AddCoursePageProps) => {
    return (
        <div className="relative h-[var(--popup-height)] w-[var(--popup-width)] bg-base flex flex-col">
            <Header title="Add Course Auto Enroll" />

            <main className="flex-1 h-0 flex flex-col items-center justify-between py-4">
                <img
                    src={helloImage}
                    alt="Hello"
                    className="w-80 h-80 object-contain"
                />
                <Button
                    text="Add Tan's course"
                    backgroundColor="var(--color-yellow)"
                    shadowColor="hsl(0deg 0% 7.5%)"
                    borderColor="hsl(0deg 0% 24%)"
                    borderRadius={20}
                    onClick={() => onNavigate("home")}
                />
            </main>
        </div>
    );
}

export default AddCoursePage;