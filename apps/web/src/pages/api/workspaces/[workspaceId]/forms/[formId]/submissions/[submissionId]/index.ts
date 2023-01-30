import { getSessionOrUser } from "@/lib/apiHelper";
import { prisma } from "@formbricks/database";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // Check Authentication
  const user: any = await getSessionOrUser(req, res);
  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const workspaceId = req.query.workspaceId.toString();
  const formId = req.query.formId.toString();
  const submissionId = req.query.submissionId.toString();

  // check workspace permission
  const membership = await prisma.membership.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });
  if (membership === null) {
    return res
      .status(403)
      .json({ message: "You don't have access to this workspace or this workspace doesn't exist" });
  }

  // GET /api/workspaces[workspaceId]/forms/[formId]/submissions/[submissionId]
  // Get a specific submission
  if (req.method === "GET") {
    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        formId: formId,
      },
    });

    return res.json(submission);
  }

  // POST /api/workspaces[workspaceId]/forms/[formId]/submissions/[submissionId]
  // Replace a specific submission
  else if (req.method === "POST") {
    const data = { ...req.body, updatedAt: new Date() };
    const prismaRes = await prisma.submission.update({
      where: { id: submissionId },
      data,
    });
    return res.json(prismaRes);
  }

  // Delete /api/workspaces[workspaceId]/forms/[formId]/submissions/[submissionId]
  // Deletes a single form
  else if (req.method === "DELETE") {
    const prismaRes = await prisma.submission.delete({
      where: { id: submissionId },
    });
    return res.json(prismaRes);
  }

  // Unknown HTTP Method
  else {
    throw new Error(`The HTTP ${req.method} method is not supported by this route.`);
  }
}
