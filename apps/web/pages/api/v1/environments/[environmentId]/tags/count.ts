import { hasEnvironmentAccess, getSessionUser } from "@/lib/api/apiHelper";
import { prisma } from "@formbricks/database/src/client";
import { TTag } from "@formbricks/types/v1/tags";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const environmentId = req.query.environmentId?.toString();

  // Check Authentication
  const currentUser = await getSessionUser(req, res);
  if (!currentUser) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Check environmentId
  if (!environmentId) {
    return res.status(400).json({ message: "Invalid environmentId" });
  }

  // Check whether user has access to the environment
  const hasAccess = await hasEnvironmentAccess(req, res, environmentId);

  if (!hasAccess) {
    return res.status(403).json({ message: "You are not authorized to access this environment! " });
  }

  // GET /api/environments/[environmentId]/tags

  // Get all tags for an environment

  if (req.method === "GET") {
    let tagsCounts;

    try {
      tagsCounts = await prisma.tagsOnResponses.groupBy({
        by: ["tagId"],
        _count: {
          _all: true,
        },
      });
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.json(tagsCounts);
  }

  // POST /api/environments/[environmentId]/tags

  // Create a new tag for a product

  if (req.method === "POST") {
    const name = req.body.name;

    if (!name) {
      return res.status(400).json({ message: "Invalid name" });
    }

    let tag: TTag;

    try {
      tag = await prisma.tag.create({
        data: {
          name,
          environmentId,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          return res.status(400).json({ message: "Tag already exists" });
        }
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.json(tag);
  }

  // Unknown HTTP Method
  else {
    throw new Error(`The HTTP ${req.method} method is not supported by this route.`);
  }
}
