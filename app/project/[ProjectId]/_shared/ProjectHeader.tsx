"use client";
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToogle'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { Pause, Play, XCircle, Key } from 'lucide-react'
import ApiKeyModal from '@/components/ApiKeyModal'
import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
// Extended Props (non-breaking)
type Props = {
  progress?: number
  loading?: boolean

  // NEW (optional)
  isPaused?: boolean
  onPause?: () => void
  onResume?: () => void
  onCancel?: () => void
}

const ProjectHeader = ({
  progress = 0,
  loading,
  isPaused = false,
  onPause,
  onResume,
  onCancel,
  
}:

Props) => {
  const { toast } = useToast()
  const handleSave = () => {
  toast({
    title: "Saved Successfully",
    description: "Your project has been saved successfully.",
  })
}
  const [showApiModal, setShowApiModal] = useState(false);
  return (
    <div>
      <div className='flex items-center justify-between p-1.5 shadow-sm'>

        {/* Left */}
    <div className='flex gap-3 items-center'>



<Image className='mt-1' src="/logowithname.png" alt="UIStudio" width={140} height={90} />

</div>

        {/* Right */}
        <div className="flex items-center gap-4">

 {/* Progress / Completed Status */}
{loading ? (
  <div className="flex items-center gap-2">
    <div className="text-xs font-medium text-blue-600 animate-pulse">
      AI Studio: {progress}%
    </div>

    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden border">
      <div
        className="h-full bg-blue-500 transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
) : progress === 100 ? (
  <div className="flex items-center gap-2">
    <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
      ● Generation Completed
    </span>

    {/* <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden border"> */}
      {/* <div className="h-full bg-green-500 w-full" /> */}
    </div>
  // </div>
) :  (
  <div className="text-xs font-medium text-black-600 flex items-center gap-1">
    ⚠️Generation Failed
  </div>
)}


          {/* 🆕 Pause / Resume / Cancel */}
          {loading && (
            <div className="flex items-center gap-2">
              {!isPaused ? (
                <Button
                  onClick={onPause}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black flex gap-1 items-center"
                  size="sm"
                >
                  <Pause size={14} />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={onResume}
                  className="bg-green-600 hover:bg-green-700 text-white flex gap-1 items-center"
                  size="sm"
                >
                  <Play size={14} />
                  Resume
                </Button>
              )}

              <Button
                onClick={onCancel}
                className="bg-red-600 hover:bg-red-700 text-white flex gap-1 items-center"
                size="sm"
              >
                <XCircle size={14} />
                Cancel
              </Button>
            </div>
          )}

          {/* Save */}
   {/* API KEY BUTTON */}
<Button
variant="outline"
size="sm"
className="flex items-center gap-1"
onClick={()=>setShowApiModal(true)}
>
<Key size={14}/>
API Key
</Button>

<Button
  className="bg-red-600 hover:bg-red-500"
  onClick={handleSave}
>
  Save {progress === 100 && (
    <span className="text-[10px] text-green-600 ml-1"> ●</span>
  )}
</Button>

          {/* User */}
          <SignedIn>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserButton />
            </div>
          </SignedIn>
        </div>

      </div>
      {showApiModal && (
  <ApiKeyModal close={()=>setShowApiModal(false)} />
)}
    </div>
  )
}

export default ProjectHeader
