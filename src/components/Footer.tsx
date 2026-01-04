const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="gov-container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              VoteVichar — Election Synchronization Feasibility & Impact Simulator
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              For policy research and analysis purposes only. No real voter data is used.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Neutral • Data-Driven • Non-Political</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
