<?php

namespace App\Libraries;

class DemoData
{
    public static function products(): array
    {
        return [
            ['id' => '1', 'name' => 'Mora fresca', 'sku' => 'AGR-001', 'unit' => 'Libra', 'category' => 'Frutas', 'sector' => 'Agropecuario', 'price' => 2.00, 'stock' => 18, 'minimum' => 8, 'description' => 'Mora fresca cultivada en Tisaleo.', 'active' => true, 'updatedDate' => '2026-10-14', 'image' => 'https://images.unsplash.com/photo-1567870335471-1129836babcf?auto=format&fit=crop&w=700&q=85'],
            ['id' => '2', 'name' => 'Canasta de fresas', 'sku' => 'AGR-004', 'unit' => 'Canasta', 'category' => 'Frutas', 'sector' => 'Agropecuario', 'price' => 4.50, 'stock' => 4, 'minimum' => 6, 'description' => 'Canasta de fresas frescas.', 'active' => true, 'updatedDate' => '2026-10-14', 'image' => 'https://images.unsplash.com/photo-1564426163878-ca1dc8011919?auto=format&fit=crop&w=700&q=85'],
            ['id' => '3', 'name' => 'Mermelada de mora', 'sku' => 'PRO-012', 'unit' => 'Frasco', 'category' => 'Procesados', 'sector' => 'Gastronómico', 'price' => 4.00, 'stock' => 5, 'minimum' => 10, 'description' => 'Mermelada artesanal de mora.', 'active' => true, 'updatedDate' => '2026-10-13', 'image' => 'https://images.unsplash.com/photo-1741160857484-cf43575bfbea?auto=format&fit=crop&w=700&q=85'],
            ['id' => '4', 'name' => 'Queso fresco', 'sku' => 'LAC-007', 'unit' => 'Unidad', 'category' => 'Lácteos', 'sector' => 'Agropecuario', 'price' => 3.50, 'stock' => 12, 'minimum' => 6, 'description' => 'Queso fresco artesanal.', 'active' => true, 'updatedDate' => '2026-10-14', 'image' => 'https://images.unsplash.com/photo-1780867657314-11140cde5816?auto=format&fit=crop&w=700&q=85'],
            ['id' => '5', 'name' => 'Yogur natural', 'sku' => 'LAC-009', 'unit' => 'Litro', 'category' => 'Lácteos', 'sector' => 'Agropecuario', 'price' => 2.75, 'stock' => 3, 'minimum' => 8, 'description' => 'Yogur natural de producción local.', 'active' => true, 'updatedDate' => '2026-10-13', 'image' => 'https://images.unsplash.com/photo-1759143259281-dea4116962a1?auto=format&fit=crop&w=700&q=85'],
            ['id' => '6', 'name' => 'Conserva artesanal', 'sku' => 'PRO-015', 'unit' => 'Frasco', 'category' => 'Procesados', 'sector' => 'Gastronómico', 'price' => 5.25, 'stock' => 9, 'minimum' => 5, 'description' => 'Conserva artesanal de temporada.', 'active' => true, 'updatedDate' => '2026-10-07', 'image' => 'https://images.unsplash.com/photo-1788711067507-0b50fd6984cb?auto=format&fit=crop&w=700&q=85'],
        ];
    }

    public static function services(): array
    {
        return [
            ['id' => 's1', 'code' => 'SER-001', 'name' => 'Ruta de emprendimientos', 'sector' => 'Turístico', 'unit' => 'Servicio', 'price' => 25.00, 'description' => 'Recorrido guiado por emprendimientos locales.', 'status' => 'Activo', 'active' => true, 'startDate' => '2026-10-01', 'endDate' => '2026-12-31', 'updatedDate' => '2026-10-14'],
            ['id' => 's2', 'code' => 'SER-002', 'name' => 'Taller artesanal', 'sector' => 'Artesanal', 'unit' => 'Servicio', 'price' => 12.00, 'description' => 'Experiencia práctica de elaboración artesanal.', 'status' => 'Activo', 'active' => true, 'startDate' => '2026-10-05', 'endDate' => '2026-11-30', 'updatedDate' => '2026-10-14'],
            ['id' => 's3', 'code' => 'SER-003', 'name' => 'Visita técnica agrícola', 'sector' => 'Agropecuario', 'unit' => 'Servicio', 'price' => 35.00, 'description' => 'Acompañamiento y visita técnica a cultivos.', 'status' => 'Activo', 'active' => true, 'startDate' => '2026-10-10', 'endDate' => '2027-01-31', 'updatedDate' => '2026-10-12'],
        ];
    }

    public static function movements(): array
    {
        return [
            ['id' => 'KDX-0184', 'date' => '2026-10-14', 'time' => '20:47', 'product' => 'Mora fresca', 'sku' => 'AGR-001', 'sector' => 'Agropecuario', 'type' => 'Venta', 'detail' => 'Venta #V-DEMO-001', 'quantity' => -2, 'unit' => 'lb', 'previous' => 20, 'final' => 18, 'user' => 'María S.'],
            ['id' => 'KDX-0183', 'date' => '2026-10-14', 'time' => '20:09', 'product' => 'Mermelada de mora', 'sku' => 'PRO-012', 'sector' => 'Gastronómico', 'type' => 'Merma', 'detail' => 'Producto dañado', 'quantity' => -1, 'unit' => 'frasco', 'previous' => 6, 'final' => 5, 'user' => 'María S.'],
            ['id' => 'KDX-0182', 'date' => '2026-10-14', 'time' => '18:40', 'product' => 'Queso fresco', 'sku' => 'LAC-007', 'sector' => 'Agropecuario', 'type' => 'Entrada', 'detail' => 'Lote LT-2026-018', 'quantity' => 8, 'unit' => 'un.', 'previous' => 4, 'final' => 12, 'user' => 'María S.'],
            ['id' => 'KDX-0181', 'date' => '2026-10-14', 'time' => '17:05', 'product' => 'Canasta de fresas', 'sku' => 'AGR-004', 'sector' => 'Agropecuario', 'type' => 'Venta', 'detail' => 'Venta #V-DEMO-002', 'quantity' => -2, 'unit' => 'canastas', 'previous' => 6, 'final' => 4, 'user' => 'María S.'],
            ['id' => 'KDX-0180', 'date' => '2026-10-14', 'time' => '13:55', 'product' => 'Yogur natural', 'sku' => 'LAC-009', 'sector' => 'Agropecuario', 'type' => 'Merma', 'detail' => 'Caducidad', 'quantity' => -1, 'unit' => 'litro', 'previous' => 4, 'final' => 3, 'user' => 'María S.'],
            ['id' => 'KDX-0179', 'date' => '2026-10-14', 'time' => '09:55', 'product' => 'Conserva artesanal', 'sku' => 'PRO-015', 'sector' => 'Gastronómico', 'type' => 'Entrada', 'detail' => 'Producción del día', 'quantity' => 5, 'unit' => 'frascos', 'previous' => 4, 'final' => 9, 'user' => 'María S.'],
        ];
    }

    public static function sales(): array
    {
        return [
            [
                'id' => 'V-DEMO-001', 'date' => '2026-10-14', 'time' => '20:47', 'payment' => 'Efectivo', 'total' => 5.00,
                'items' => [
                    ['sku' => 'AGR-001', 'name' => 'Mora fresca', 'sector' => 'Agropecuario', 'kind' => 'Producto', 'quantity' => 2, 'unit' => 'Libra', 'price' => 2.50, 'total' => 5.00],
                ],
            ],
            [
                'id' => 'V-DEMO-002', 'date' => '2026-10-14', 'time' => '17:05', 'payment' => 'Transferencia', 'total' => 7.00,
                'items' => [
                    ['sku' => 'LAC-007', 'name' => 'Queso fresco', 'sector' => 'Agropecuario', 'kind' => 'Producto', 'quantity' => 2, 'unit' => 'Unidad', 'price' => 3.50, 'total' => 7.00],
                ],
            ],
            [
                'id' => 'V-DEMO-003', 'date' => '2026-10-13', 'time' => '15:22', 'payment' => 'Efectivo', 'total' => 25.00,
                'items' => [
                    ['sku' => 'SER-001', 'name' => 'Ruta de emprendimientos', 'sector' => 'Turístico', 'kind' => 'Servicio', 'quantity' => 1, 'unit' => 'Paquete turístico', 'price' => 25.00, 'total' => 25.00],
                ],
            ],
        ];
    }
}
