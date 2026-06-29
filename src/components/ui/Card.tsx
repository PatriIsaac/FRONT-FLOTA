import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div className={cn("ui-card", className)} {...props} />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div className={cn("ui-card-header", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("ui-card-title", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("ui-card-desc", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: CardProps) {
  return (
    <div className={cn("ui-card-content", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div className={cn("ui-card-footer", className)} {...props} />
  );
}
