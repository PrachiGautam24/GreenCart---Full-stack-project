import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TestAccountsInfoProps {
  onFillCredentials?: (email: string, password: string) => void;
}

const TestAccountsInfo = ({ onFillCredentials }: TestAccountsInfoProps) => {
  const testAccounts = [
    {
      type: "Buyer",
      email: "buyer1@greencart.com",
      password: "buyer123",
      description: "Test buyer account with order history"
    },
    {
      type: "Seller",
      email: "seller1@greencart.com",
      password: "seller123",
      description: "Test seller account with products"
    },
    {
      type: "Admin",
      email: "admin@greencart.com",
      password: "admin123",
      description: "Admin account with full access"
    }
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Test Accounts</CardTitle>
        <CardDescription className="text-xs">
          Use these accounts for testing (Development Only)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {testAccounts.map((account) => (
          <div key={account.email} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{account.type}</span>
              {onFillCredentials && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onFillCredentials(account.email, account.password)}
                >
                  Use This
                </Button>
              )}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email:</span>
                <div className="flex items-center gap-1">
                  <code className="bg-muted px-2 py-1 rounded">{account.email}</code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(account.email, "Email")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Password:</span>
                <div className="flex items-center gap-1">
                  <code className="bg-muted px-2 py-1 rounded">{account.password}</code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(account.password, "Password")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{account.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TestAccountsInfo;
