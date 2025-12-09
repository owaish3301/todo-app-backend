const { z } = require('zod');

const addTodoSchema = z.object({
  title: z
    .string({
      error: (e) =>
        e.input === undefined
          ? "Todo title is required"
          : "Invalid todo title input",
    })
    .min(1, "Todo title cant be empty"),
  hexColor: z
    .string({
      error: (e) =>
        e.input === undefined ? "color is required" : "Invalid color input",
    })
    .min(1, "Color cant be empty"),
  isFinished: z.boolean().optional(),
  scheduleTime: z.string().optional(),
  scheduledDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date({
      error: (e) =>
        e.input === undefined ? "Schedule date is required" : "Invalid date input",
    })
  ),
});

// const updateTodoSchema = z.object({
//   title: z.string().min(1).optional(),
//   hexColor: z.string().min(1).optional(),
//   isFinished: z.boolean().optional(),
//   scheduleTime: z.string().optional(),
//   scheduledDate: z.preprocess(
//     (val) => (typeof val === 'string' ? new Date(val) : val),
//     z.date().optional()
//   ),
// });

module.exports = {
  addTodoSchema,
};
