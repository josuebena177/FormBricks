import TagsCombobox from "@/app/environments/[environmentId]/surveys/[surveyId]/responses/TagsCombobox";
import { useResponses } from "@/lib/responses/responses";
import { removeTagFromResponse, useAddTagToResponse, useCreateTag } from "@/lib/tags/mutateTags";
import { useTagsForEnvironment } from "@/lib/tags/tags";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Tag } from "./Tag";

interface ResponseTagsWrapperProps {
  tags: {
    tagId: string;
    tagName: string;
  }[];
  environmentId: string;
  surveyId: string;
  responseId: string;
}

const ResponseTagsWrapper: React.FC<ResponseTagsWrapperProps> = ({
  tags,
  environmentId,
  responseId,
  surveyId,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = React.useState(false);
  const [tagsState, setTagsState] = useState(tags);
  const [tagIdToHighlight, setTagIdToHighlight] = useState("");

  const { createTag } = useCreateTag(environmentId);
  const { mutateResponses } = useResponses(environmentId, surveyId);
  const { data: environmentTags, mutate: refetchEnvironmentTags } = useTagsForEnvironment(environmentId);
  const { addTagToRespone } = useAddTagToResponse(environmentId, surveyId, responseId);

  const onDelete = async (tagId: string) => {
    try {
      await removeTagFromResponse(environmentId, surveyId, responseId, tagId);

      mutateResponses();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tagIdToHighlight) {
        setTagIdToHighlight("");
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [tagIdToHighlight]);

  return (
    <div className="flex items-start gap-3 p-6">
      <div className="flex flex-wrap items-center gap-2">
        {tagsState?.map((tag) => (
          <Tag
            key={tag.tagId}
            onDelete={onDelete}
            tagId={tag.tagId}
            tagName={tag.tagName}
            tags={tagsState}
            setTagsState={setTagsState}
            highlight={tagIdToHighlight === tag.tagId}
          />
        ))}

        <TagsCombobox
          open={open}
          setOpen={setOpen}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          tags={environmentTags?.map((tag) => ({ value: tag.id, label: tag.name })) ?? []}
          currentTags={tagsState.map((tag) => ({ value: tag.tagId, label: tag.tagName }))}
          createTag={(tagName) => {
            createTag(
              {
                name: tagName?.trim() ?? "",
              },
              {
                onSuccess: (data) => {
                  setTagsState((prevTags) => [
                    ...prevTags,
                    {
                      tagId: data.id,
                      tagName: data.name,
                    },
                  ]);
                  addTagToRespone(
                    {
                      tagIdToAdd: data.id,
                    },
                    {
                      onSuccess: () => {
                        setSearchValue("");
                        setOpen(false);
                        mutateResponses();

                        refetchEnvironmentTags();
                      },
                    }
                  );
                },
                onError: (err) => {
                  toast.error(err?.message ?? "Something went wrong", {
                    duration: 2000,
                  });

                  setSearchValue("");
                  setOpen(false);
                  mutateResponses();

                  const tag = tags.find((tag) => tag.tagName === tagName?.trim() ?? "");
                  setTagIdToHighlight(tag?.tagId ?? "");

                  refetchEnvironmentTags();
                },
              }
            );
          }}
          addTag={(tagId) => {
            setTagsState((prevTags) => [
              ...prevTags,
              {
                tagId,
                tagName: environmentTags?.find((tag) => tag.id === tagId)?.name ?? "",
              },
            ]);

            addTagToRespone(
              {
                tagIdToAdd: tagId,
              },
              {
                onSuccess: () => {
                  setSearchValue("");
                  setOpen(false);
                  mutateResponses();

                  refetchEnvironmentTags();
                },
              }
            );
          }}
        />
      </div>
    </div>
  );
};

export default ResponseTagsWrapper;
