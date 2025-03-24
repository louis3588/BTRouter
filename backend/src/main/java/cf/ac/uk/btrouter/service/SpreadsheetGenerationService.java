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
import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SpreadsheetGenerationService {

    private final OrderRepository orderRepository;


    public String[] HEADERS = {
            "Reference Number", "Customer Type", "Router Type", "Primary Inside Ports", "Primary Inside Connection",
            "Primary Outside Ports", "Primary Outside Connection", "Secondary Outside Ports", "Secondary Outside Connection",
            "VLAN Configuration", "VLAN Assignments", "DHCP Configuration", "Number of Routers", "Site name", "Address",
            "Postcode", "Primary Email", "Phone number", "Contact name", "Priority level", "Current Status", "IP Address",
            "Additional Configuration Details", "Order date"
    };

    public SpreadsheetGenerationService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    private List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    private List<String> getDistinctCustomers(){
        return orderRepository.findDistinctBySitePrimaryEmail();

    }

    public void write(File file, boolean separateSheets){
        try(Workbook wb = new XSSFWorkbook()){
            writeOrders(getAllOrders(), wb);
            if(separateSheets){
                writeOrdersByCustomer(getDistinctCustomers(), wb);
            }

            try (FileOutputStream fos = new FileOutputStream(file)){
                wb.write(fos);
            }
        } catch (IOException e){
            throw new RuntimeException(e);
        }
    }

    private void writeOrders(List<Order> orders, Workbook wb) {
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

    }

    private void writeOrdersByCustomer(List<String> distinctCustomers, Workbook wb) {
        for (String customerEmail : distinctCustomers) {
            Sheet sheet = wb.createSheet(customerEmail);
            createHeaderRow(sheet);
            int rowNum = 1;
            List<Order> customerOrders = orderRepository.findOrdersByEmail(customerEmail);
            for (Order order : customerOrders) {
                Row row = sheet.createRow(rowNum++);
                populateRows(row, order);
            }
            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }
        }

    }

    private void populateRows(Row row, Order order) {
        int colNum = 0;
        row.createCell(colNum++).setCellValue(order.getReferenceNumber());
        row.createCell(colNum++).setCellValue(order.getCustomerType());
        row.createCell(colNum++).setCellValue(order.getRouterType());
        row.createCell(colNum++).setCellValue(order.getPrimaryInsidePorts());
        row.createCell(colNum++).setCellValue(order.getPrimaryInsideConnection());
        row.createCell(colNum++).setCellValue(order.getPrimaryOutsidePorts());
        row.createCell(colNum++).setCellValue(order.getPrimaryOutsideConnection());
        row.createCell(colNum++).setCellValue(order.getSecondaryOutsidePorts());
        row.createCell(colNum++).setCellValue(order.getSecondaryOutsideConnection());
        row.createCell(colNum++).setCellValue(order.getVlanConfiguration());
        row.createCell(colNum++).setCellValue(order.getVlanAssignments());
        row.createCell(colNum++).setCellValue(order.getDhcpConfiguration());
        row.createCell(colNum++).setCellValue(order.getNumRouters());
        row.createCell(colNum++).setCellValue(order.getSiteName());
        row.createCell(colNum++).setCellValue(order.getAddress());
        row.createCell(colNum++).setCellValue(order.getPostcode());
        row.createCell(colNum++).setCellValue(order.getEmail());
        row.createCell(colNum++).setCellValue(order.getPhoneNumber());
        row.createCell(colNum++).setCellValue(order.getSiteContactName());
        row.createCell(colNum++).setCellValue(order.getPriorityLevel());
        row.createCell(colNum++).setCellValue(order.getStatus());
        row.createCell(colNum++).setCellValue(order.getIpAddress());
        row.createCell(colNum++).setCellValue(order.getConfigurationDetails());
        row.createCell(colNum++).setCellValue(order.getOrderDate());
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
