import * as xlsx from 'xlsx'

interface ExportOptions {
  filename: string
}

export function exportXLSX(data: any[][], options: ExportOptions) {
  const { filename } = options

  const savefile = `${filename.replace('.xlsx', '')}.xlsx`

  const ws = xlsx.utils.aoa_to_sheet(data)

  const wb = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1')
  xlsx.writeFile(wb, savefile)
}
