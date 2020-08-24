export async function delay(timeout: number = 100) {
  await new Promise((res) => setTimeout(res, timeout));
}
