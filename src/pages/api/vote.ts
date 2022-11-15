import { type NextApiRequest, type NextApiResponse } from "next";
import { object } from "zod";

import { prisma } from "../../server/db/client";

const vote = async (req: NextApiRequest, res: NextApiResponse) => {

    const {id, choice} = req.body

    if(choice > 2 || choice < 0) {

        return res.status(401).json({"error": "choices out of range"})

    }

    const question = await prisma.question.findUnique({

        where: {
            id: id
        }

    });
    
    const answer = await prisma.answer.create({
        data: {
            questionId: id,
            option: choice
        }
    })

    const options1 = await prisma.answer.aggregate({
        where: {
            questionId: id,
            option: 1
        },

        _count: {
            option: true
        }

    })

    const total = await prisma.answer.aggregate({

        where: {
            questionId: id, 
        },

        _count: {
            option: true
        }

    })

    const percentage = Math.round(options1._count.option/total._count.option * 100)

    console.log(percentage)
    res.status(200).json({"success": true, "percentage": percentage, "choice": choice})

};

export default vote;
