import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Flame,
  Phone,
  ShieldAlert,
  Stethoscope,
  Waves,
} from "lucide-react";
import { useState } from "react";

export default function SOSFab() {
  const [open, setOpen] = useState(false);

  async function send(type: "fire" | "police" | "medical" | "disaster") {
    try {
      const coords = await getLocation();
      await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, location: coords }),
      });
      setOpen(false);
      alert("SOS sent to responders with your location.");
    } catch (e) {
      alert("Couldn't get location. Please call the helpline immediately.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-6 right-6 z-50 rounded-full bg-red-600 text-white shadow-xl transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300">
          <div className="flex h-16 w-16 items-center justify-center">
            <AlertTriangle className="h-8 w-8" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Emergency SOS</DialogTitle>
          <DialogDescription>
            Select a service or call directly.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => send("police")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ShieldAlert className="mr-2" /> Police
          </Button>
          <Button
            onClick={() => send("medical")}
            className="bg-green-600 hover:bg-green-700"
          >
            <Stethoscope className="mr-2" /> Medical
          </Button>
          <Button
            onClick={() => send("fire")}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Flame className="mr-2" /> Fire
          </Button>
          <Button
            onClick={() => send("disaster")}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <Waves className="mr-2" /> Disaster
          </Button>
        </div>
        <div className="pt-2 text-sm text-muted-foreground">
          Your GPS coordinates will be shared automatically.
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Phone className="h-4 w-4" />
          <a href="tel:112" className="text-primary underline">
            Call 112 (India Emergency)
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function getLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("No geolocation"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 },
    );
  });
}
