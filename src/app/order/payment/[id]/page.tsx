interface PageProps {
  params: { id: string };
}

const Page = ({ params }: PageProps) => {
  const { id } = params;

  return (
    <div>
      <h1>Product ID: {id}</h1>
    </div>
  );
};

export default Page;
