package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.repository.OrderRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class SpreadsheetGenerationService {

    private final OrderRepository orderRepository;

    public String[] HEADERS = {
            "Order ID", "Site Name", "Router Model", "IP Address", "Configuration Details", "Router Type", "Quantity",
            "Address", "City", "Postcode", "Email", "Phone Number"
    };

    public SpreadsheetGenerationService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public void write(File file){
        try(Workbook wb = new XSSFWorkbook()){
            writeOrders(getAllOrders(), wb, file);
        } catch (IOException e){
            throw new RuntimeException(e);
        }
    }

    private Boolean writeOrders(List<Order> orders, Workbook wb, File file) {
        Sheet sheet = wb.createSheet("Full orders");
        createHeaderRow(sheet);

        int rowNum = 1;

        for (int i = 0; i < orders.size(); i++) {
            Row row = sheet.createRow(rowNum++);
            populateRows(row, orders.get(i));
        }

        for (int i = 0; i < HEADERS.length; i++) {
            sheet.autoSizeColumn(i);
        }

        try (FileOutputStream fos = new FileOutputStream(file)){
            wb.write(fos);
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    private void populateRows(Row row, Order order) {
        int colNum = 0;
        row.createCell(colNum++).setCellValue(String.valueOf(order.getId()));
        row.createCell(colNum++).setCellValue(order.getSiteName());
        row.createCell(colNum++).setCellValue(order.getRouterModel());
        row.createCell(colNum++).setCellValue(order.getIpAddress());
        row.createCell(colNum++).setCellValue(order.getConfigurationDetails());
        row.createCell(colNum++).setCellValue(order.getRouterType());
        row.createCell(colNum++).setCellValue(String.valueOf(order.getNumberOfRouters()));
        row.createCell(colNum++).setCellValue(order.getAddress());
        row.createCell(colNum++).setCellValue(order.getCity());
        row.createCell(colNum++).setCellValue(order.getPostcode());
        row.createCell(colNum++).setCellValue(order.getEmail());
        row.createCell(colNum++).setCellValue(order.getPhoneNumber());
    }

    private void createHeaderRow(Sheet sheet) {
        Row row = sheet.createRow(0);
        CellStyle headerStyle = sheet.getWorkbook().createCellStyle();
        Font headerFont = sheet.getWorkbook().createFont();
        headerFont.setBold(true);
        headerFont.setFontName("Roboto");

        IndexedColors headerColor = IndexedColors.GREY_40_PERCENT;
        XSSFColor xssfColor = new XSSFColor(headerColor, null);
        headerStyle.setFillBackgroundColor(xssfColor);
        headerStyle.setFont(headerFont);

        for (int i = 0; i < HEADERS.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(HEADERS[i]);
            cell.setCellStyle(headerStyle);
        }
    }
}
