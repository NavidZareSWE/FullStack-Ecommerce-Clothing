// Section/page heading. Renders a real heading element (h2 by default) so the
// page has a meaningful heading outline for screen reader users.
const Title = ({ text1, text2, as: Heading = "h2", id }) => {
  return (
    // flex-wrap + overflow-wrap: with very large text the decorative line
    // moves below and long words break instead of causing sideways scrolling
    <div className="mb-3 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1">
      <Heading
        id={id}
        className="min-w-0 text-gray-600 [overflow-wrap:anywhere]"
      >
        {text1} <span className="font-medium text-gray-800">{text2}</span>
      </Heading>
      <span
        aria-hidden="true"
        className="h-[1px] w-8 bg-gray-700 sm:h-[2px] sm:w-12"
      ></span>
    </div>
  );
};

export default Title;
