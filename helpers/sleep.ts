// TODO: Remove this utility helper - it's used only in testing and on dev (when you want to simulate long running processes)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default sleep;
