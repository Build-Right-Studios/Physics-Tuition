export const generateSubTopicId = async ({ chapterId, CounterModel }) => {
  const counter = await CounterModel.findOneAndUpdate(
    { _id: chapterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return {
    id: `st_${chapterId}_${String(counter.seq).padStart(2, "0")}`,
    order: counter.seq
  };
};
