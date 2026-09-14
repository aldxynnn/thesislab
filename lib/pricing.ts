export type Service={id:string;name:string;category:string;price:number;description:string};
export const defaultServices:Service[]=[
{id:'bab1',name:'Pendampingan Bab 1',category:'BAB',price:175000,description:'Latar belakang, rumusan masalah, tujuan dan struktur penelitian.'},
{id:'bab2',name:'Pendampingan Bab 2',category:'BAB',price:225000,description:'Landasan teori, penelitian terdahulu, kerangka dan hipotesis.'},
{id:'bab3',name:'Pendampingan Bab 3',category:'BAB',price:250000,description:'Metode, populasi, sampel, variabel dan teknik analisis.'},
{id:'bab4',name:'Pendampingan Bab 4',category:'BAB',price:350000,description:'Hasil penelitian, output, interpretasi dan pembahasan.'},
{id:'bab5',name:'Pendampingan Bab 5',category:'BAB',price:150000,description:'Kesimpulan, implikasi, keterbatasan dan saran.'},
{id:'olah',name:'Analisis Data',category:'DATA',price:275000,description:'Pendampingan SPSS/Excel dan interpretasi hasil.'},
{id:'editing',name:'Editing Akademik',category:'EXTRA',price:125000,description:'Bahasa, struktur, konsistensi dan typo.'},
{id:'format',name:'Formatting Akhir',category:'EXTRA',price:100000,description:'Daftar isi, tabel, gambar dan format kampus.'}];
export function calcTotal(s:Service[],ids:string[],priority=false,voucherPct=0){const subtotal=s.filter(x=>ids.includes(x.id)).reduce((a,x)=>a+x.price,0);const bundlePct=ids.length>=4?10:ids.length>=3?5:0;const bundle=Math.round(subtotal*bundlePct/100);const voucher=Math.round((subtotal-bundle)*voucherPct/100);const priorityFee=priority?Math.round((subtotal-bundle-voucher)*.2):0;return{subtotal,bundlePct,bundle,voucherPct,voucher,priorityFee,total:Math.max(0,subtotal-bundle-voucher+priorityFee)}}
