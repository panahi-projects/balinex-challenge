import { SearchHighlight } from "@/features";
import { Card } from "@/shared";

const SearchHighlightPage = () => {
  return (
    <div className="container mx-auto my-4">
      <Card className="max-w-4xl mx-auto">
        <SearchHighlight />
      </Card>
    </div>
  );
};

export default SearchHighlightPage;
