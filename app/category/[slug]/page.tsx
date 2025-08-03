
export default async function Category({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const {slug} = await params;

  console.log(slug);

  return (
    <div>{`Category ${slug}`}</div>
  )
}
