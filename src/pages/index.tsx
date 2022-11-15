import { PrismaClient, Question } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

type Props = {
  questions: Question[];
};
const Home = ({ questions }: Props) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const handleAnswer = async (choice: number) => {
    const vote = await fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: question?.id,
        choice: choice,
      }),
    });

    const data = await vote.json();
    setResult(data.percentage);
  };

  return (
    <>
      <h1 className="p-5 text-center text-4xl font-bold">Would You Rather</h1>
      {question && !result ? (
        <div className="w-full">
          <h3 className="text-center text-3xl">{question.text}</h3>
          <div className="flex w-full p-5">
            <div
              onClick={() => handleAnswer(1)}
              className="w-full rounded-l-lg bg-red-500 p-10 text-center"
            >
              {question.option1}
            </div>
            <div
              onClick={() => handleAnswer(2)}
              className="w-full rounded-r-lg bg-blue-500 p-10 text-center"
            >
              {question.option2}
            </div>
          </div>
        </div>
      ) : (
        <>
          {!result ? (
            <div className="flex justify-center">
              <button
                onClick={() =>
                  questions.length > 0
                    ? setQuestion(questions[0] as Question)
                    : alert("no q")
                }
                className="text-center"
              >
                Start
              </button>
            </div>
          ) : (
            <>
              <div className="w-full">
                <h3 className="text-center text-3xl">{question?.text}</h3>
                <div className="flex w-full p-5">
                  <div
                    onClick={() => handleAnswer(1)}
                    className="w-full rounded-l-lg bg-red-500 p-10 text-center"
                  >
                    {result}%
                  </div>
                  <div
                    onClick={() => handleAnswer(2)}
                    className="w-full rounded-r-lg bg-blue-500 p-10 text-center"
                  >
                    {100 - result}%
                  </div>
                </div>
                <p onClick={}></p>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export const getServerSideProps = async () => {
  const prisma = new PrismaClient();

  const questions = await prisma.question.findMany();

  return {
    props: {
      questions,
    },
  };
};

export default Home;

/*

() => setQuestion(questions[questions.indexOf(question) + 1])


*/
