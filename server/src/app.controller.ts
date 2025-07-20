import { Controller, Post, UploadedFile, UseInterceptors, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import * as fs from 'fs';

@Controller('api')
export class DataController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const workbook = xlsx.read(file.buffer);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const range = xlsx.utils.decode_range(sheet['!ref']!);

      const headers: string[] = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const mainHeaderCell = sheet[xlsx.utils.encode_cell({ r: 0, c: C })];
        const subHeaderCell = sheet[xlsx.utils.encode_cell({ r: 1, c: C })];
        const mainHeader = mainHeaderCell ? mainHeaderCell.v.toString().trim() : '';
        const subHeader = subHeaderCell ? subHeaderCell.v.toString().trim() : '';
        const header = (mainHeader + ' ' + subHeader).replace(/\s+/g, ' ').trim();
        headers.push(header);
      }

      console.log('💡 Заголовки:', headers);

      const jsonData = xlsx.utils.sheet_to_json(sheet, {
        header: headers,
        range: 2,
        defval: '',
      });

      const mrgData = jsonData.map((row: any) => {
        console.log('👉 строка:', row);

        const excelDate = row['Период'] || row[' Период'] || '';
        let period = excelDate;

        if (typeof excelDate === 'number') {
          period = xlsx.SSF.format('dd/mm/yyyy', excelDate);
        }

        return {
          name: row['Магистральный распределительный газопровод'] || '',
          mg: row['Точка подключения МГ (РГ, КС, УРГ)'] || '',
          km: (() => {
            const val =
              row['Точка подключения км'] ||
              row['км'] ||
              row[' Точка подключения км'] ||
              '';
            const str = val.toString().trim();
            if (!str || str === '-') return null;
            const num = parseFloat(str.replace(',', '.'));
            return isNaN(num) ? null : num;
          })(),
          period,
          loadLevel: parseFloat(
            (row['Уровень загрузки'] || '0').toString().replace(',', '.')
          ),
          actualFlow: parseFloat(
            (row['Факт. среднесут. расход, млн.м3/сут'] || '0').toString().replace(',', '.')
          ),
          technicalFlow: parseFloat(
            (row['ТВПС, млн. м3/сут'] || '0').toString().replace(',', '.')
          ),
        };
      });

      fs.writeFileSync('data.json', JSON.stringify(mrgData, null, 2), 'utf-8');
      return { message: 'Файл успешно загружен', data: mrgData };
    } catch (error) {
      console.error(error);
      return { error: 'Ошибка при обработке файла', details: error.message };
    }
  }

  @Get('data')
  async getData() {
    try {
      const rawData = fs.readFileSync('data.json', 'utf-8');
      return JSON.parse(rawData);
    } catch (error) {
      return { error: 'Данные не найдены', details: error.message };
    }
  }
}