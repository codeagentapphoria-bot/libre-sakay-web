import { Download } from 'lucide-react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import Button from './Button';

export default function InstallButton() {
  const { canInstall, install, isInstalled } = useInstallPrompt();

  if (isInstalled) {
    return null;
  }

  if (!canInstall) {
    return null;
  }

  return (
    <Button
      onClick={install}
      className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-3 py-2 flex items-center gap-2 w-full md:w-auto justify-center"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Install App</span>
      <span className="sm:hidden">Install App</span>
    </Button>
  );
}
