import { useEffect, useRef, useState } from 'react';

interface KonfHubWidgetProps {
  eventId?: string;
  buttonId?: string;
  mode?: 'button' | 'iframe';
  ticketId?: string;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
  className?: string;
}

/**
 * KonfHub Widget Component
 * Integrates KonfHub's ticketing widget for seamless pass purchases
 */
export function KonfHubWidget({
  eventId = import.meta.env.VITE_KONFHUB_EVENT_ID || 'final-tcet-esummit26',
  buttonId = import.meta.env.VITE_KONFHUB_BUTTON_ID || 'btn_a2352136e92a',
  mode = 'iframe',
  ticketId,
  onSuccess,
  onClose,
  className = '',
}: KonfHubWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (mode === 'button') {
      // Throttle script loading to prevent rate limiting
      const loadScript = () => {
        const script = document.createElement('script');
        script.src = 'https://widget.konfhub.com/widget.js';
        script.setAttribute('button_id', buttonId);
        script.async = true;
        
        script.onload = () => {
          setIsLoading(false);
        };

        script.onerror = () => {
          console.error('Failed to load KonfHub widget script');
          setIsLoading(false);
        };

        if (widgetRef.current) {
          widgetRef.current.appendChild(script);
        }
      };

      // Delay loading and only load once
      const timeoutId = setTimeout(loadScript, isMobile ? 2000 : 500);

      return () => {
        clearTimeout(timeoutId);
        if (widgetRef.current) {
          const scripts = widgetRef.current.querySelectorAll('script');
          scripts.forEach(script => {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
          });
        }
      };
    } else {
      // Iframe mode - delay loading on mobile
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, isMobile ? 1000 : 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [mode, buttonId, isMobile]);

  // Listen for messages from KonfHub widget
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from KonfHub
      if (event.origin !== 'https://konfhub.com' && event.origin !== 'https://widget.konfhub.com') {
        return;
      }

      const data = event.data;

      if (data.type === 'konfhub_purchase_complete') {
        // KonfHub purchase completed successfully
        onSuccess?.(data);
      } else if (data.type === 'konfhub_widget_closed') {
        // KonfHub widget closed by user
        onClose?.();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSuccess, onClose]);

  if (mode === 'button') {
    return (
      <div ref={widgetRef} className={className}>
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>
    );
  }

  // Iframe mode
  if (isMobile) {
    // Disable KonfHub widget on mobile to prevent rate limiting
    return (
      <div className={`flex items-center justify-center p-8 bg-muted/50 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="text-2xl mb-2">🎫</div>
          <h3 className="font-semibold mb-2">Pass Booking</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please visit this page on a desktop device to purchase passes.
          </p>
          <p className="text-xs text-muted-foreground">
            Mobile booking is temporarily disabled to ensure a smooth experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      <iframe
        src={`https://konfhub.com/widget/${eventId}?desc=false&secondaryBg=F7F7F7&ticketBg=F7F7F7&borderCl=F7F7F7&bg=FFFFFF&fontColor=1e1f24&ticketCl=1e1f24&btnColor=d0021b&fontFamily=Hind&borderRadius=10&widget_type=standard${ticketId ? `&tickets=${ticketId}&ticketId=${ticketId}%7C1` : ''}`}
        id="konfhub-widget"
        title={`Register for ${import.meta.env.VITE_APP_NAME || 'E-Summit 2026'}`}
        width="100%"
        height={isMobile ? "500" : "600"}
        style={{ 
          border: 'none', 
          minHeight: isMobile ? '500px' : '600px', 
          maxHeight: isMobile ? '70vh' : '80vh',
          display: isLoading ? 'none' : 'block'
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          console.error('KonfHub iframe failed to load');
          setIsLoading(false);
        }}
        className="rounded-lg"
        loading="lazy"
      />
    </div>
  );
}
