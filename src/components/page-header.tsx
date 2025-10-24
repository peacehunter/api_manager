import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="bg-card shadow-sm p-4 px-6 border-b">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div>{children}</div>
      </div>
    </header>
  );
}
