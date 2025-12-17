import { useState } from "react";
import { useDispatch } from "react-redux";
import { authService } from "@/store/services/authService";
import { setCredentials } from "@/store/slices/authSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import TestAccountsInfo from "@/components/TestAccountsInfo";
import ValidatedInput from "@/components/ui/validated-input";
import { validateEmail, validatePassword, ValidationResult } from "@/utils/validation";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
}

const LoginDialog = ({ open, onOpenChange, onSwitchToRegister }: LoginDialogProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validationResults, setValidationResults] = useState({
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      dispatch(setCredentials(response.data));
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      onOpenChange(false);
      setFormData({ email: "", password: "" });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || "Invalid credentials";
      toast({
        title: "Login failed",
        description: errorMessage === "Invalid credentials" 
          ? "Email or password is incorrect. Try using a test account below or register a new account."
          : errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = (email: string, password: string) => {
    setFormData({ email, password });
  };

  const handleValidation = (field: string, result: ValidationResult) => {
    setValidationResults(prev => ({
      ...prev,
      [field]: result
    }));
  };

  const isFormValid = validationResults.email.isValid && validationResults.password.isValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome Back</DialogTitle>
          <DialogDescription>
            Login to your GreenCart account to continue shopping
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ValidatedInput
            id="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            onValidation={(result) => handleValidation('email', result)}
            validator={validateEmail}
            required
          />

          <ValidatedInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            onValidation={(result) => handleValidation('password', result)}
            validator={validatePassword}
            required
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !isFormValid || !formData.email || !formData.password}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onSwitchToRegister();
              }}
              className="text-primary hover:underline"
            >
              Sign up
            </button>
          </div>
        </form>

        {/* Show test accounts in development */}
        {import.meta.env.DEV && (
          <TestAccountsInfo onFillCredentials={handleFillCredentials} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
