"use client"

import { useState } from "react"
import { Download, FileJson, FileSpreadsheet, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trade } from "@/types/trade.types"
// Assuming types based on your slice
interface Holding {
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  currentValue: number
  profitLoss: number
}

interface ExportDialogProps {
  holdings: Holding[]
  trades: Trade[]
}

export function ExportDialog({ holdings, trades }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Helper to trigger browser download
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a")
    const file = new Blob([content], { type: contentType })
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
  }

  const exportCSV = () => {
    setIsExporting(true)
    
    // 1. Create CSV Headers
    const headers = ["Record Type", "Symbol", "Date", "Type", "Quantity", "Price", "Total Value", "P&L"]
    let csvContent = headers.join(",") + "\n"

    // 2. Add Holdings Rows
    holdings.forEach((h) => {
      const row = [
        "HOLDING",
        h.symbol,
        new Date().toLocaleDateString(), // Current date for holdings
        "HOLD",
        h.quantity,
        h.averagePrice.toFixed(2),
        h.currentValue.toFixed(2),
        h.profitLoss.toFixed(2)
      ]
      csvContent += row.join(",") + "\n"
    })

    // 3. Add Trade History Rows
    trades.forEach((t) => {
      const row = [
        "TRADE",
        t.symbol,
        new Date(t.executedAt).toLocaleDateString(),
        t.type,
        t.quantity,
        t.price.toFixed(2),
        t.totalCost.toFixed(2),
        "N/A" // No P&L for individual trade record entry
      ]
      csvContent += row.join(",") + "\n"
    })

    // 4. Download
    setTimeout(() => {
      downloadFile(csvContent, `portfolio_export_${new Date().toISOString().split('T')[0]}.csv`, "text/csv")
      setIsExporting(false)
      setIsOpen(false)
    }, 800) // Small artificial delay for UX feel
  }

  const exportJSON = () => {
    setIsExporting(true)
    const data = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalHoldings: holdings.length,
        totalTrades: trades.length
      },
      holdings,
      trades
    }

    setTimeout(() => {
      downloadFile(JSON.stringify(data, null, 2), `portfolio_data.json`, "application/json")
      setIsExporting(false)
      setIsOpen(false)
    }, 500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-2 shadow-sm hover:translate-y-[2px] hover:shadow-none transition-all">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </DialogTrigger>
      
      {/* Brutalist Dialog Styling */}
      <DialogContent className="sm:max-w-[425px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Export Data</DialogTitle>
          <DialogDescription className="text-base font-medium text-muted-foreground">
            Choose a format to download your portfolio snapshot.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          {/* CSV Option */}
          <button
            onClick={exportCSV}
            disabled={isExporting}
            className="group flex items-center justify-between rounded-xl border-2 border-black p-4 text-left transition-all hover:bg-emerald-50 dark:border-white dark:hover:bg-emerald-950/30"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full border-2 border-black bg-emerald-100 p-2.5 dark:border-white dark:bg-emerald-900">
                <FileSpreadsheet className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
              </div>
              <div>
                <p className="font-bold">CSV / Excel</p>
                <p className="text-xs text-muted-foreground">Best for spreadsheets</p>
              </div>
            </div>
            {isExporting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          </button>

          {/* JSON Option */}
          <button
            onClick={exportJSON}
            disabled={isExporting}
            className="group flex items-center justify-between rounded-xl border-2 border-black p-4 text-left transition-all hover:bg-blue-50 dark:border-white dark:hover:bg-blue-950/30"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full border-2 border-black bg-blue-100 p-2.5 dark:border-white dark:bg-blue-900">
                <FileJson className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <p className="font-bold">JSON</p>
                <p className="text-xs text-muted-foreground">Raw data format</p>
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}