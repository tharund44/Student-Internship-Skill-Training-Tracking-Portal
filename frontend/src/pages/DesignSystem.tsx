import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassInput } from '../components/ui/GlassInput';
import { GlassBadge } from '../components/ui/GlassBadge';

export const DesignSystem = () => {
  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Lavender Glass Design System</h2>
        <p className="text-gray-600">Component library overview.</p>
      </div>
      
      <GlassCard className="space-y-4">
        <h3 className="text-xl font-semibold">Buttons</h3>
        <div className="flex gap-4 flex-wrap">
          <GlassButton variant="primary">Primary Button</GlassButton>
          <GlassButton variant="ghost">Ghost Button</GlassButton>
        </div>
      </GlassCard>
      
      <GlassCard className="space-y-4">
        <h3 className="text-xl font-semibold">Inputs</h3>
        <div className="max-w-sm space-y-4">
          <GlassInput label="Email Address" placeholder="name@college.edu" />
          <GlassInput label="Password" type="password" error="Password is required" />
        </div>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h3 className="text-xl font-semibold">Badges</h3>
        <div className="flex gap-4 flex-wrap">
          <GlassBadge status="default">Draft</GlassBadge>
          <GlassBadge status="info">Applied</GlassBadge>
          <GlassBadge status="warning">Under Review</GlassBadge>
          <GlassBadge status="success">Selected</GlassBadge>
          <GlassBadge status="error">Rejected</GlassBadge>
        </div>
      </GlassCard>
    </div>
  );
};
