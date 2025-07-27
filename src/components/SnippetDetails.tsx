// import { useParams } from "react-router";

const SnippetDetails = () => {
  // const { id } = useParams();
  const snippet = null;

  if (!snippet) {
    return <div>Snippet not found</div>;
  }

  return <div>Details page</div>;
};

export default SnippetDetails;
