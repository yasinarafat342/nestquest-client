import { useState } from "react";
import { FiShare2, FiCheck, FiFacebook, FiTwitter, FiLink } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ShareButton({ title, text }) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        // user cancelled share - no action needed
      }
    } else {
      setShowMenu((prev) => !prev);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "width=600,height=400");
    setShowMenu(false);
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || title)}`, "_blank", "width=600,height=400");
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="btn-outline w-full flex items-center justify-center gap-2"
      >
        {copied ? <FiCheck className="text-green-600" /> : <FiShare2 />}
        {copied ? "Link Copied!" : "Share Property"}
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 p-2 z-20 space-y-1">
            <button onClick={shareToFacebook} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
              <FiFacebook className="text-blue-600" /> Share on Facebook
            </button>
            <button onClick={shareToTwitter} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
              <FiTwitter className="text-sky-500" /> Share on X (Twitter)
            </button>
            <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
              <FiLink className="text-gray-500" /> Copy Link
            </button>
          </div>
        </>
      )}
    </div>
  );
}