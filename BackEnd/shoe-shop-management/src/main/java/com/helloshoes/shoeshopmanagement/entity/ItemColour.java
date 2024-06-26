package com.helloshoes.shoeshopmanagement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "item_colour")
public class ItemColour implements SuperEntity {
    @Id
    private String id;
    @Column(columnDefinition = "LONGTEXT")
    private String imgPath;
    private Double sellPrice;
    private Double buyPrice;

    @ManyToOne
    @JoinColumn(name = "item_id")
    @JsonBackReference
    private Item item;

    @ManyToOne
    @JoinColumn(name = "colour_id")
    @JsonBackReference
    private Colour colour;
}
