// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Shield, ChevronRight, Key, Smartphone, Monitor, 
//   Chrome, Laptop, AlertTriangle, CheckCircle2, Eye, EyeOff 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import { cn } from '@/lib/utils';

// const activeSessions = [
//   {
//     id: '1',
//     device: 'Chrome on MacOS',
//     icon: Chrome,
//     location: 'New York, US',
//     lastActive: 'Active now',
//     isCurrent: true,
//   },
//   {
//     id: '2',
//     device: 'Safari on iPhone',
//     icon: Smartphone,
//     location: 'New York, US',
//     lastActive: '2 hours ago',
//     isCurrent: false,
//   },
//   {
//     id: '3',
//     device: 'Chrome on Windows',
//     icon: Laptop,
//     location: 'Boston, US',
//     lastActive: '3 days ago',
//     isCurrent: false,
//   },
// ];

// export default function SecuritySettings() {
//   const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
//   const [showPasswordSection, setShowPasswordSection] = useState(false);
  
//   return (
//     <motion.section
//       // initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//       className="bg-card rounded-2xl border border-border overflow-hidden"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between px-5 py-4 border-b border-border">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
//             <Shield className="h-5 w-5 text-success" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-foreground">Security & Login</h3>
//             <p className="text-sm text-muted-foreground">Protect your account</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-1.5">
//           <CheckCircle2 className="h-4 w-4 text-success" />
//           <span className="text-sm font-medium text-success">Secure</span>
//         </div>
//       </div>
      
//       <div className="divide-y divide-border">
//         {/* Password */}
//         <div className="p-4">
//           <div 
//             className="flex items-center justify-between cursor-pointer group"
//             onClick={() => setShowPasswordSection(!showPasswordSection)}
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
//                 <Key className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
//               </div>
//               {/* <div>
//                 <h4 className="font-medium text-foreground">Password</h4>
//                 <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
//               </div> */}
//             </div>
//             {/* <Button variant="ghost" size="sm">
//               Change
//             </Button> */}
//           </div>
//         </div>
        
//         {/* Two-Factor Authentication */}
//         <div className="p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               {/* <div className={cn(
//                 "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
//                 twoFactorEnabled ? "bg-success/10" : "bg-secondary"
//               )}> */}
//                 {/* <Smartphone className={cn(
//                   "h-5 w-5 transition-colors",
//                   twoFactorEnabled ? "text-success" : "text-muted-foreground"
//                 )} /> */}
//               </div>
//               {/* <div>
//                 <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
//                 <p className="text-sm text-muted-foreground">
//                   {twoFactorEnabled 
//                     ? 'Enabled via authenticator app' 
//                     : 'Add extra security to your account'}
//                 </p>
//               </div> */}
//             </div>
//             <Switch 
//               // checked={twoFactorEnabled}
//               // onCheckedChange={setTwoFactorEnabled}
//             />
//           </div>
//         </div>
        
//         {/* Active Sessions */}
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
//                 <Monitor className="h-5 w-5 text-muted-foreground" />
//               </div>
//               <div>
//                 <h4 className="font-medium text-foreground">Active Sessions</h4>
//                 <p className="text-sm text-muted-foreground">{activeSessions.length} devices logged in</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="space-y-2 ml-[52px]">
//             {activeSessions.map((session) => {
//               const SessionIcon = session.icon;
//               return (
//                 <div 
//                   key={session.id}
//                   className={cn(
//                     "flex items-center justify-between p-3 rounded-lg",
//                     session.isCurrent ? "bg-primary/5 border border-primary/20" : "bg-secondary/50"
//                   )}
//                 >
//                   <div className="flex items-center gap-3">
//                     <SessionIcon className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm font-medium text-foreground flex items-center gap-2">
//                         {session.device}
//                         {session.isCurrent && (
//                           <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
//                             This device
//                           </span>
//                         )}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {session.location} • {session.lastActive}
//                       </p>
//                     </div>
//                   </div>
//                   {!session.isCurrent && (
//                     <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive text-xs">
//                       Revoke
//                     </Button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
          
//           <Button variant="outline" size="sm" className="mt-3 ml-[52px]">
//             Sign out all other sessions
//           </Button>
//         </div>
//       </div>
//     </motion.section>
//   );
// }
