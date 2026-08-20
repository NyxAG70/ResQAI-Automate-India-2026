import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
      <div className="text-primary text-6xl mb-4 font-mono-ui">404</div>
      <h1 className="text-2xl font-bold tracking-tight">System Node Not Found</h1>
      <p className="text-muted-foreground max-w-md">
        The requested operational view could not be located in the central registry.
      </p>
      <Link href="/">
        <div className="mt-8 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm cursor-pointer hover:bg-primary/90 font-mono-ui">
          RETURN TO COMMAND
        </div>
      </Link>
    </div>
  );
}
