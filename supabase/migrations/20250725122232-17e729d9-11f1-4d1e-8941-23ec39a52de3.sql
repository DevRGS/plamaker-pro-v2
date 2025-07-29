-- Create table for admin settings
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Only admins can view admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Only admins can insert admin settings" 
ON public.admin_settings 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Only admins can update admin settings" 
ON public.admin_settings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES 
('plan_templates', '{
  "pdv-food": {
    "monthly": 110.00,
    "annual": 99.00
  },
  "gestao-food": {
    "monthly": 277.67,
    "annual": 249.00
  },
  "performance-food": {
    "monthly": 443.33,
    "annual": 399.00
  },
  "autoatendimento-food": {
    "monthly": 332.50,
    "annual": 299.00
  },
  "pdv-varejo": {
    "monthly": 110.00,
    "annual": 99.00
  },
  "gestao-varejo": {
    "monthly": 277.67,
    "annual": 249.00
  },
  "performance-varejo": {
    "monthly": 443.33,
    "annual": 399.00
  },
  "autoatendimento-varejo": {
    "monthly": 332.50,
    "annual": 299.00
  },
  "bling": {
    "monthly": 210.00,
    "annual": 189.00
  }
}'),
('module_help_links', '{}'),
('plan_limits', '{
  "pdv": {
    "mandatoryModules": [],
    "optionalModules": [],
    "limits": {}
  },
  "gestao": {
    "mandatoryModules": [],
    "optionalModules": [],
    "limits": {}
  },
  "performance": {
    "mandatoryModules": [],
    "optionalModules": [],
    "limits": {}
  },
  "autoatendimento": {
    "mandatoryModules": [],
    "optionalModules": [],
    "limits": {}
  },
  "bling": {
    "mandatoryModules": [],
    "optionalModules": [],
    "limits": {}
  }
}');