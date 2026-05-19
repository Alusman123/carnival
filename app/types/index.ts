// components/ui/index.ts
// ─────────────────────────────────────────────────────────────
// Barrel export — import any UI component from '@/components/ui'
//
// Usage:
//   import { Button, Input, Card, Badge } from '@/components/ui'
//   import { StatusBadge, StatsCard, Modal } from '@/components/ui'
// ─────────────────────────────────────────────────────────────

// ── Buttons ──────────────────────────────────────────────────
export { Button, IconButton } from "../components/ui/Button";
export type { ButtonProps, IconButtonProps, ButtonVariant, ButtonSize } from '../components/ui/Button';

// ── Loading ───────────────────────────────────────────────────
export { LoadingSpinner, FullPageSpinner } from '../components/ui/LoadingSpinner';
export type { SpinnerSize, SpinnerColor } from '../components/ui/LoadingSpinner';

// ── Inputs / Forms ────────────────────────────────────────────
export { Input, PasswordInput, TextArea, Checkbox } from '../components/ui/Input';
export type { InputProps, PasswordInputProps, TextAreaProps, CheckboxProps } from '../components/ui/Input';

export {
  FormWrapper,
  FormErrorMessage,
  SearchBar,
  SelectDropdown,
} from '../components/ui/Form';
export type {
  FormWrapperProps,
  FormErrorMessageProps,
  SearchBarProps,
  SelectDropdownProps,
  SelectOption,
} from '../components/ui/Form';

// ── Cards ─────────────────────────────────────────────────────
export { Card, CardHeader, CardTitle, CardFooter, StatsCard, InfoCard } from '../components/ui/Card';
export type {
  CardProps,
  CardVariant,
  CardPadding,
  StatsCardProps,
  StatsTrend,
  InfoCardProps,
} from '../components/ui/Card';

// ── Badges ────────────────────────────────────────────────────
export { Badge, StatusBadge, UserRoleBadge, NotifBadge } from '../components/ui/Badge';
export type {
  BadgeProps,
  BadgeVariant,
  BadgeSize,
  StatusBadgeProps,
  DocumentStatus,
  UserRoleBadgeProps,
  UserRole,
  NotifBadgeProps,
} from '../components/ui/Badge';

// ── Misc (Avatar, Logo, Divider, Tooltip) ────────────────────
export { Avatar, Logo, Divider, Tooltip } from '../components/ui/Misc';
export type {
  AvatarProps,
  AvatarSize,
  LogoProps,
  LogoSize,
  LogoVariant,
  DividerProps,
  TooltipProps,
  TooltipPosition,
} from '../components/ui/Misc';

// ── Feedback / UI States ──────────────────────────────────────
export {
  SkeletonText,
  SkeletonCard,
  SkeletonTableRow,
  EmptyState,
  ErrorMessage,
  SuccessMessage,
  ToastContainer,
} from '../components/ui/Feedback';
export type { EmptyStateProps, Toast, ToastType } from '../components/ui/Feedback';

// ── Overlays ──────────────────────────────────────────────────
export { Tabs, Modal, ConfirmationModal } from '../components/ui/Overlays';
export type {
  TabItem,
  TabsProps,
  TabVariant,
  ModalProps,
  ModalSize,
  ConfirmationModalProps,
  ConfirmVariant,
} from '../components/ui/Overlays';