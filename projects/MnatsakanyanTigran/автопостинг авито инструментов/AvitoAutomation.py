import pandas as pd
import random
import os
from datetime import datetime

class AvitoAutomation:
    def __init__(self):
        self.base_columns = [
            "Id", "Category", "GoodsType", "AdType", "Title", 
            "Description", "Price", "Address", "Condition", 
            "AllowEmail", "ManagerName", "Contactphone", "Images",
            "VideoURL", "AdStatus"
        ]
        
    def generate_unique_description(self, tool_name, specs):
        """Создает уникальный текст объявления из шаблонов."""
        intros = [
            f"Продаем отличный {tool_name}.",
            f"В наличии профессиональный {tool_name} для стройки.",
            f"Предлагаем надежный {tool_name} по выгодной цене."
        ]
        features = [
            f"Основные характеристики: {specs}.",
            f"Технические данные: {specs}.",
            f"Инструмент проверен, параметры: {specs}."
        ]
        outros = [
            "Звоните прямо сейчас, пока в наличии!",
            "Пишите в чат, отвечу быстро.",
            "Самовывоз или доставка. Гарантия."
        ]
        
        return f"{random.choice(intros)}\n\n{random.choice(features)}\n\n{random.choice(outros)}"

    def create_extended_catalog(self):
        """Генерирует расширенную базу данных товаров."""
        inventory = [
            {
                "id_prefix": "EL-",
                "name": "Перфоратор Makita HR2470",
                "specs": "780 Вт, 2.7 Дж, 3 режима",
                "base_price": 9000,
                "count": 5
            },
            {
                "id_prefix": "PN-",
                "name": "Компрессор масляный Fubag",
                "specs": "24 л, 222 л/мин, 8 бар",
                "base_price": 12500,
                "count": 3
            },
            {
                "id_prefix": "NW-",
                "name": "Нейлер пневматический Bostitch",
                "specs": "Тип гвоздя 16Ga, до 64мм",
                "base_price": 18000,
                "count": 4
            }
        ]
        
        rows = []
        for item in inventory:
            for i in range(item['count']):
                unique_id = f"{item['id_prefix']}{1000 + i}"
                # Добавляем небольшую вариацию цены (+/- 2%) для уникальности
                final_price = int(item['base_price'] * random.uniform(0.98, 1.02))
                
                row = {
                    "Id": unique_id,
                    "Category": "Ремонт и строительство",
                    "GoodsType": "Инструменты",
                    "AdType": "Товар приобретен на продажу",
                    "Title": f"{item['name']} (Арт. {random.randint(10,99)})",
                    "Description": self.generate_unique_description(item['name'], item['specs']),
                    "Price": final_price,
                    "Address": "Москва, ул. Строителей, д. 10",
                    "Condition": "Новое",
                    "AllowEmail": "Да",
                    "ManagerName": "Дмитрий",
                    "Contactphone": "+79161234567",
                    "Images": f"https://cdn.tooldrive.ru/img/{unique_id}.jpg",
                    "VideoURL": "",
                    "AdStatus": "Free"  # Тип размещения
                }
                rows.append(row)
        
        return pd.DataFrame(rows)

    def save_to_excel(self, df, folder="outputs"):
        """Сохраняет готовую таблицу для загрузки в Авито."""
        if not os.path.exists(folder):
            os.makedirs(folder)
            
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        filename = f"{folder}/avito_upload_{timestamp}.xlsx"
        
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Ads')
            
        print(f"Сгенерировано объявлений: {len(df)}")
        print(f"Файл сохранен: {filename}")

if __name__ == "__main__":
    bot = AvitoAutomation()
    data = bot.create_extended_catalog()
    bot.save_to_excel(data)